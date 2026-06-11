import { useForm } from 'react-hook-form';

const AuthForm = ({ mode = 'login', onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fields = [
    {
      name: 'username',
      label: 'Username',
      show: mode === 'register',
    },
    {
      name: 'email',
      label: 'Email',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields
        .filter((field) => field.show !== false)
        .map((field) => (
          <div key={field.name} className="space-y-1">
            <label htmlFor={field.name} className="text-sm text-white/60">
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type || 'text'}
              {...register(field.name, { 
                required: `${field.label} is required`,
                ...(field.name === 'email' && { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' } })
              })}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white focus:border-primary"
            />
            {errors[field.name] && (
              <p className="text-xs text-red-400">
                {errors[field.name].message || `${field.label} is required`}
              </p>
            )}
          </div>
        ))}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary py-3 font-semibold text-secondary disabled:opacity-50"
      >
        {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
};

export default AuthForm;

