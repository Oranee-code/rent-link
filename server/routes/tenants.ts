import express from 'express'
import db from '../db/connection.js'
import checkJwt from '../auth0.js'
import nodemailer from 'nodemailer'

const router = express.Router()

// Get all tenants (for landlords to see available tenants)
router.get('/', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.sub
    const landlord = await db('users').where('auth0_id', auth0Id).first()
    
    if (!landlord || landlord.role !== 'owner') {
      return res.status(403).json({ error: 'Only landlords can view tenant lists' })
    }

    // Get all tenants in the system
    const tenants = await db('users')
      .where('role', 'tenant')
      .select('id', 'name', 'email', 'phone', 'profile_photo', 'created_at')
      .orderBy('name')

    res.json(tenants)
  } catch (error) {
    console.error('Error fetching tenants:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get available tenants (not currently assigned to any unit)
router.get('/available', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.sub
    const landlord = await db('users').where('auth0_id', auth0Id).first()
    
    if (!landlord || landlord.role !== 'owner') {
      return res.status(403).json({ error: 'Only landlords can view available tenants' })
    }

    // Get tenants who are not currently assigned to any unit
    const availableTenants = await db('users')
      .where('role', 'tenant')
      .whereNotExists(function() {
        this.select('*')
          .from('units')
          .whereRaw('units.tenant_id = users.id')
      })
      .select('id', 'name', 'email', 'phone', 'profile_photo', 'created_at')
      .orderBy('name')

    res.json(availableTenants)
  } catch (error) {
    console.error('Error fetching available tenants:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Send invitation to potential tenant
router.post('/invite', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.sub
    const landlord = await db('users').where('auth0_id', auth0Id).first()
    
    if (!landlord || landlord.role !== 'owner') {
      return res.status(403).json({ error: 'Only landlords can send invitations' })
    }

    const { email, message, propertyId, unitId } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Check if user already exists
    const existingUser = await db('users').where('email', email).first()
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Create invitation record
    const invitation = await db('tenant_invitations').insert({
      landlord_id: landlord.id,
      email: email,
      message: message,
      property_id: propertyId,
      unit_id: unitId,
      status: 'pending',
      expires_at: db.raw('DATE_ADD(NOW(), INTERVAL 7 DAY)')
    })

    // Send invitation email
    await sendInvitationEmail(email, landlord.name, message, invitation[0])

    res.json({ 
      message: 'Invitation sent successfully',
      invitationId: invitation[0]
    })
  } catch (error) {
    console.error('Error sending invitation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get pending invitations
router.get('/invitations', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.sub
    const landlord = await db('users').where('auth0_id', auth0Id).first()
    
    if (!landlord || landlord.role !== 'owner') {
      return res.status(403).json({ error: 'Only landlords can view invitations' })
    }

    const invitations = await db('tenant_invitations')
      .where('landlord_id', landlord.id)
      .select('*')
      .orderBy('created_at', 'desc')

    res.json(invitations)
  } catch (error) {
    console.error('Error fetching invitations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Accept invitation (called by tenant)
router.post('/invitations/:invitationId/accept', checkJwt, async (req, res) => {
  try {
    const { invitationId } = req.params
    const auth0Id = req.auth?.sub
    const tenant = await db('users').where('auth0_id', auth0Id).first()

    if (!tenant || tenant.role !== 'tenant') {
      return res.status(403).json({ error: 'Only tenants can accept invitations' })
    }

    // Get invitation
    const invitation = await db('tenant_invitations')
      .where('id', invitationId)
      .where('email', tenant.email)
      .where('status', 'pending')
      .first()

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found or already used' })
    }

    // Update invitation status
    await db('tenant_invitations')
      .where('id', invitationId)
      .update({ 
        status: 'accepted',
        accepted_at: db.fn.now(),
        tenant_id: tenant.id
      })

    // If unit was specified, assign tenant to unit
    if (invitation.unit_id) {
      await db('units')
        .where('id', invitation.unit_id)
        .update({
          tenant_id: tenant.id,
          status: 'occupied',
          updated_at: db.fn.now()
        })
    }

    res.json({ message: 'Invitation accepted successfully' })
  } catch (error) {
    console.error('Error accepting invitation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Helper function to send invitation email
async function sendInvitationEmail(email: string, landlordName: string, message: string, invitationId: number) {
  // Configure email transporter (you'll need to set up your email service)
  const transporter = nodemailer.createTransporter({
    // Configure your email service here
    // Example for Gmail:
    // service: 'gmail',
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASS
    // }
  })

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@rentlink.com',
    to: email,
    subject: `Rental Invitation from ${landlordName}`,
    html: `
      <h2>You've been invited to join Rent Link!</h2>
      <p>Hi there!</p>
      <p>${landlordName} has invited you to become a tenant on Rent Link.</p>
      ${message ? `<p><strong>Message from landlord:</strong> ${message}</p>` : ''}
      <p>Click the link below to accept this invitation and create your tenant account:</p>
      <a href="${process.env.FRONTEND_URL}/accept-invitation/${invitationId}" 
         style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
        Accept Invitation
      </a>
      <p>This invitation expires in 7 days.</p>
      <p>Best regards,<br>The Rent Link Team</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Invitation email sent to:', email)
  } catch (error) {
    console.error('Error sending invitation email:', error)
    throw error
  }
}

export default router 