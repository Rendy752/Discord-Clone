import { currentUser, redirectToSignIn } from '@clerk/nextjs';
import { db } from '@/lib/db';

// This function is used to create a profile for the user if it doesn't exist
// Prevent duplicate profiles for the same user
export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    if (user.username !== profile.name || user.imageUrl !== profile.imageUrl || user.emailAddresses[0].emailAddress !== profile.email) {
      await db.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          name: user.username || `${user.firstName} ${user.lastName}`,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }

    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: user.username || `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newProfile;
};
