import { NextRequest, NextResponse } from 'next/server';
import { db, prisma } from '@/lib/prisma';
import crypto from 'crypto';

// ─── Webhook Signature Verification ────────────────────────────
function verifyWebhookSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const sig = signature.startsWith('sha256=') ? signature.slice(7) : signature;
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

async function verifyApiKey(request: NextRequest): Promise<boolean> {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) return false;

  // Check against stored API keys
  // const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
  const key = await prisma.apiKey.findFirst({
    where: { key: apiKey, isActive: true }
  }).catch(() => null);

  return !!key;
}

export async function POST(request: NextRequest) {
  try {
    // ─── Authentication: Require API key OR webhook signature ───
    const rawBody = await request.text();
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const signature = request.headers.get('x-webhook-signature') || request.headers.get('x-hin-signature');

    let authenticated = false;

    // Method 1: API key authentication
    const apiKey = request.headers.get('x-api-key');
    if (apiKey) {
      authenticated = await verifyApiKey(request);
    }

    // Method 2: Webhook signature verification
    if (!authenticated && webhookSecret && signature) {
      authenticated = verifyWebhookSignature(rawBody, signature, webhookSecret);
    }

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Valid API key or webhook signature required' },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody);
    const {
      event_type,
      amount_cents,
      currency = 'USD',
      customer_email,
      attribution_key,
      referral_code,
      event_metadata = {},
    } = body;

    // Validate required fields
    if (!event_type || !customer_email) {
      return NextResponse.json(
        { success: false, message: 'Event type and customer email are required' },
        { status: 400 }
      );
    }

    let affiliate = null;
    let attributionMethod = 'none';

    // Try to find affiliate through attribution key first
    if (attribution_key) {
      // In a real implementation, this would be stored in Redis
      // For this simulation, we'll comment out the problematic call
      // const recentClicks = await db.getClicksByReferralId('some-referral-id');
      // For demo purposes, we'll use referral_code method
      attributionMethod = 'attribution_key';
    }

    // Fallback to referral code
    if (!affiliate && referral_code) {
      affiliate = await db.getAffiliateByReferralCode(referral_code);
      attributionMethod = 'referral_code';
    }

    // If no affiliate found, log the conversion but don't create commission
    if (!affiliate) {
      console.log('Conversion received but no affiliate attribution found:', {
        event_type,
        customer_email,
        attribution_key,
        referral_code,
      });
      
      return NextResponse.json({
        success: true,
        message: 'Conversion logged (no attribution)',
        attributed: false,
      });
    }

    // Create conversion record
    const conversion = await db.createConversion({
      affiliateId: affiliate.id,
      eventType: event_type,
      amountCents: amount_cents || 0,
      currency,
      eventMetadata: {
        ...event_metadata,
        customerEmail: customer_email,
        attributionMethod,
        attributionKey: attribution_key,
        referralCode: referral_code,
      },
    });

    // Calculate commission
    const commissionRules = await db.getCommissionRules();
    let applicableRule = commissionRules.find((rule: any) => rule.isDefault);

    // Check for tier-based rules (commented out - complex conditions in JSON)
    /*
    if (amount_cents && amount_cents >= 500000) { // $5000+
      const enterpriseRule = commissionRules.find((rule: any) => 
        rule.name.includes('Enterprise') && 
        (rule.conditions as any)?.min_amount_cents && 
        amount_cents >= (rule.conditions as any).min_amount_cents
      );
      if (enterpriseRule) applicableRule = enterpriseRule;
    }
    */

    // Check for volume-based rules (commented out - complex conditions)
    /*
    const affiliateStats = await db.getAffiliateStats(affiliate.userId);
    if (affiliateStats.totalConversions >= 10) {
      const bonusRule = commissionRules.find((rule: any) => 
        rule.name.includes('Bonus') && 
        (rule.conditions as any)?.tier_requirements?.min_monthly_referrals
      );
      if (bonusRule) applicableRule = bonusRule;
    }
    */

    const commissionRate = applicableRule?.value || 15;
    let commissionAmount = 0;

    if (applicableRule?.type === 'PERCENTAGE' && amount_cents) {
      commissionAmount = Math.floor((amount_cents * commissionRate) / 100);
    } else if (applicableRule?.type === 'FIXED') {
      commissionAmount = commissionRate; // Rate is in cents for flat commissions
    }

    // Create commission record
    const commission = await db.createCommission({
      conversionId: conversion.id,
      affiliateId: affiliate.id,
      userId: affiliate.userId,
      amountCents: commissionAmount,
      rate: commissionRate,
    });

    // Update affiliate balance
    await db.updateAffiliate(affiliate.id, {
      balanceCents: affiliate.balanceCents + commissionAmount,
    });

    // Log audit event
    await db.createAuditLog({
      actorId: 'system',
      action: 'conversion_tracked',
      objectType: 'conversion',
      objectId: conversion.id,
      payload: {
        event_type,
        amount_cents,
        commission_amount: commissionAmount,
        affiliate_id: affiliate.id,
        attributionMethod,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Conversion tracked successfully',
      attributed: true,
      conversion,
      commission,
      attributionMethod,
    });
  } catch (error) {
    console.error('Conversion webhook error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process conversion' },
      { status: 500 }
    );
  }
}