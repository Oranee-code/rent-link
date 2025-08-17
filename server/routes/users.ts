import express from 'express'
import db from '../db/connection.js'
import checkJwt from '../auth0.js'
import multer from 'multer'
import path from 'path'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Get user profile
router.get('/profile', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.sub
    const user = await db('users').where('auth0_id', auth0Id).first()
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create or update user profile
router.post('/profile', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.sub
    const { name, email, role, phone, bio, address, city, state, zip_code, country } = req.body
    
    // Check if user exists
    const existingUser = await db('users').where('auth0_id', auth0Id).first()
    
    if (existingUser) {
      // Update existing user
      await db('users')
        .where('auth0_id', auth0Id)
        .update({
          name,
          email,
          role,
          phone,
          bio,
          address,
          city,
          state,
          zip_code,
          country,
          updated_at: db.fn.now()
        })
    } else {
      // Create new user
      await db('users').insert({
        auth0_id: auth0Id,
        name,
        email,
        role,
        phone,
        bio,
        address,
        city,
        state,
        zip_code,
        country
      })
    }
    
    res.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Upload profile photo
router.post('/profile/photo', checkJwt, upload.single('photo'), async (req, res) => {
  try {
    const auth0Id = req.auth?.sub
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    
    const photoUrl = `/uploads/profiles/${req.file.filename}`
    
    await db('users')
      .where('auth0_id', auth0Id)
      .update({
        profile_photo: photoUrl,
        updated_at: db.fn.now()
      })
    
    res.json({ 
      message: 'Profile photo uploaded successfully',
      photoUrl 
    })
  } catch (error) {
    console.error('Error uploading profile photo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update notification settings
router.put('/settings', checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth?.sub
    const { email_notifications, sms_notifications } = req.body
    
    await db('users')
      .where('auth0_id', auth0Id)
      .update({
        email_notifications,
        sms_notifications,
        updated_at: db.fn.now()
      })
    
    res.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error updating settings:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user by ID (for other users to view)
router.get('/:id', checkJwt, async (req, res) => {
  try {
    const { id } = req.params
    const user = await db('users')
      .select('id', 'name', 'profile_photo', 'bio', 'role')
      .where('id', id)
      .first()
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router 