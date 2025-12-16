// Vercel Serverless Function Example
// File: /api/submit-tester.js
//
// This is an example API endpoint for handling alpha tester form submissions
// Deploy this to your Vercel project to handle form data

// Required: Install dependencies in your Vercel project
// npm install @vercel/node
//
// Optional: Install if using external services
// npm install @supabase/supabase-js  (for database storage)
// npm install nodemailer             (for email notifications)
// npm install @sendgrid/mail         (alternative email service)

import { createClient } from '@supabase/supabase-js';

// Environment variables (set in Vercel dashboard)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Initialize Supabase client (if using)
const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

/**
 * Main handler for alpha tester form submissions
 * @param {Request} request - Incoming HTTP request
 * @param {Response} response - HTTP response object
 */
export default async function handler(request, response) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    const data = request.body;

    // Validate required fields
    const validation = validateFormData(data);
    if (!validation.valid) {
      return response.status(400).json({
        error: 'Validation failed',
        message: validation.errors.join(', ')
      });
    }

    // Generate unique application ID
    const applicationId = generateApplicationId();
    const enrichedData = {
      ...data,
      applicationId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      userAgent: request.headers['user-agent'],
      ipAddress: request.headers['x-forwarded-for'] || request.connection.remoteAddress
    };

    // Store in database (Supabase example)
    if (supabase) {
      const { error: dbError } = await supabase
        .from('alpha_testers')
        .insert([enrichedData]);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to store application');
      }
    } else {
      // Fallback: Log to console if no database configured
      console.log('New alpha tester application:', enrichedData);
    }

    // Send confirmation email to applicant (optional)
    await sendConfirmationEmail(data.personalInfo.email, applicationId);

    // Send notification to admin (optional)
    await sendAdminNotification(enrichedData);

    // Return success response
    return response.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: applicationId
    });

  } catch (error) {
    console.error('Submission error:', error);
    return response.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process application. Please try again later.'
    });
  }
}

/**
 * Validate form data completeness
 * @param {Object} data - Form data object
 * @returns {Object} Validation result
 */
function validateFormData(data) {
  const errors = [];

  // Required fields validation
  if (!data.personalInfo?.fullName) {
    errors.push('Full name is required');
  }

  if (!data.personalInfo?.email || !isValidEmail(data.personalInfo.email)) {
    errors.push('Valid email address is required');
  }

  if (!data.gamingExperience?.level) {
    errors.push('Gaming experience level is required');
  }

  if (!data.testingExperience?.weeklyHours) {
    errors.push('Weekly hours commitment is required');
  }

  if (!data.interests?.whyTest || data.interests.whyTest.length < 20) {
    errors.push('Please provide a detailed reason (at least 20 characters)');
  }

  if (!data.additional?.agreeTerms || !data.additional?.agreeNDA) {
    errors.push('You must agree to the terms and NDA');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Simple email validation
 * @param {string} email - Email address to validate
 * @returns {boolean} Is valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate unique application ID
 * @returns {string} Unique ID
 */
function generateApplicationId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `AT-${timestamp}-${randomStr}`.toUpperCase();
}

/**
 * Send confirmation email to applicant
 * @param {string} email - Applicant email
 * @param {string} applicationId - Application ID
 */
async function sendConfirmationEmail(email, applicationId) {
  // Example using SendGrid or similar service
  // Implement based on your email service choice

  try {
    // If using SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //
    // const msg = {
    //   to: email,
    //   from: 'noreply@yourgame.com',
    //   subject: 'Overlord Alpha Tester Application Received',
    //   text: `Thank you for applying! Your application ID is: ${applicationId}`,
    //   html: `<p>Thank you for applying to be an Overlord alpha tester!</p>
    //          <p>Your application ID: <strong>${applicationId}</strong></p>
    //          <p>We'll review your application within 3-5 business days.</p>`
    // };
    //
    // await sgMail.send(msg);

    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Email error:', error);
    // Don't throw - email failure shouldn't block application submission
  }
}

/**
 * Send notification to admin about new application
 * @param {Object} data - Application data
 */
async function sendAdminNotification(data) {
  if (!ADMIN_EMAIL) return;

  try {
    // Send email to admin with application summary
    console.log(`Admin notification sent for application ${data.applicationId}`);
  } catch (error) {
    console.error('Admin notification error:', error);
  }
}

// Supabase table schema for reference:
//
// CREATE TABLE alpha_testers (
//   id BIGSERIAL PRIMARY KEY,
//   application_id TEXT UNIQUE NOT NULL,
//   full_name TEXT NOT NULL,
//   email TEXT NOT NULL,
//   discord_username TEXT,
//   timezone TEXT,
//   gaming_experience JSONB,
//   testing_experience JSONB,
//   technical_setup JSONB,
//   interests JSONB,
//   additional JSONB,
//   status TEXT DEFAULT 'pending',
//   submitted_at TIMESTAMP WITH TIME ZONE,
//   reviewed_at TIMESTAMP WITH TIME ZONE,
//   reviewer_notes TEXT,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// CREATE INDEX idx_alpha_testers_email ON alpha_testers(email);
// CREATE INDEX idx_alpha_testers_status ON alpha_testers(status);
// CREATE INDEX idx_alpha_testers_submitted ON alpha_testers(submitted_at DESC);
