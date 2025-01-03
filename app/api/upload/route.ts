import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const cloudName = 'dxvkzqwgi';
const uploadPreset = 'social_media';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const isSignup = formData.get('isSignup') === 'true';
    console.log('isSignup:', isSignup);
    
    // Only check authentication for non-signup requests
    if (!isSignup) {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        console.log('Unauthorized access attempt');
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const file = formData.get('file');
    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File received:', file);

    // Create a new FormData instance for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', uploadPreset);

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    const uploadResult = await uploadResponse.json();
    if (!uploadResponse.ok) {
      console.error('Cloudinary upload error:', uploadResult);
      throw new Error(uploadResult.message || 'Failed to upload image');
    }

    console.log('Upload successful:', uploadResult.secure_url);
    return NextResponse.json({
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { message: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 