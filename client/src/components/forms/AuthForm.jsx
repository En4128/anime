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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {fields
        .filter((field) => field.show !== false)
        .map((field) => (
          <div key={field.name} className="space-y-1.5">
            <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-white/50 block pl-1">
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type || 'text'}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              {...register(field.name, { 
                required: `${field.label} is required`,
                ...(field.name === 'email' && { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' } })
              })}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder-white/20 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.05] focus:border-primary focus:bg-black/50 focus:ring-4 focus:ring-primary/20 outline-none cursor-text"
            />
            {errors[field.name] && (
              <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1 animate-fade-in pl-1">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errors[field.name].message || `${field.label} is required`}</span>
              </p>
            )}
          </div>
        ))}
      
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent py-3.5 font-bold text-black transition-all duration-300 hover:from-accent hover:to-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Please wait...</span>
            </>
          ) : (
            <>
              <span>{mode === 'login' ? 'Sign In to Stream' : 'Create Stream Account'}</span>
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-shine" />
      </button>
    </form>
  );
};

export default AuthForm;

