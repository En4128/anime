import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { userApi } from '../api/user.api.js';

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: user?.username,
      bio: user?.bio,
      avatar: user?.avatar,
      banner: user?.banner,
    },
  });

  const onSubmit = async (values) => {
    await userApi.updateProfile(values);
    await refreshProfile();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/5 bg-secondary/30 p-6">
        <h1 className="font-display text-3xl">Profile</h1>
        <p className="text-white/60">Manage your account details and preferences.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 rounded-3xl border border-white/5 bg-secondary/30 p-6 md:grid-cols-2">
        {['username', 'bio', 'avatar', 'banner'].map((field) => (
          <label key={field} className="flex flex-col gap-2 text-sm text-white/70">
            {field === 'bio' ? 'Bio' : field.charAt(0).toUpperCase() + field.slice(1)}
            {field === 'bio' ? (
              <textarea
                {...register(field)}
                rows={4}
                className="rounded-2xl border border-white/10 bg-black/20 p-3 text-white focus:border-primary"
              />
            ) : (
              <input
                type="text"
                {...register(field)}
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-primary"
              />
            )}
          </label>
        ))}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-primary px-8 py-3 font-semibold text-secondary disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;

