import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { RetroVulnerabilityModal } from './RetroVulnerabilityModal';

interface RegistrationFormData {
  fullName: string;
  collegeEmail: string;
  phoneNumber: string;
  enrollmentNumber: string;
  course: string;
  yearOfStudy: string;
}

interface ValidationErrors {
  fullName?: string;
  collegeEmail?: string;
  phoneNumber?: string;
  enrollmentNumber?: string;
  course?: string;
  yearOfStudy?: string;
}

const COURSES = [
  'B.Tech CSE',
  'B.Tech AI/ML',
  'B.Tech ECE',
  'BCA',
  'MCA',
  'Other',
];

const YEARS_OF_STUDY = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
];

export const RegistrationSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    collegeEmail: '',
    phoneNumber: '',
    enrollmentNumber: '',
    course: '',
    yearOfStudy: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);
  const [showVulnerabilityPopup, setShowVulnerabilityPopup] = useState(false);

  // Subtle ambient background particles effect with soft iridescent purple/blue glow
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.28,
      speedY: -Math.random() * 0.35 - 0.1,
      color: Math.random() > 0.4 ? 'rgba(255, 255, 255,' : 'rgba(168, 85, 247,',
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion]);

  const validateField = (name: keyof RegistrationFormData, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Please enter a valid full name';
        return undefined;
      case 'collegeEmail':
        if (!value.trim()) return 'College email is required';
        // Email RFC validation regex
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address';
        }
        return undefined;
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        // Validate Indian 10-digit mobile numbers (optional +91 or 0 prefix allowed)
        if (!/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(value.trim())) {
          return 'Enter a valid 10-digit Indian mobile number (starts with 6-9)';
        }
        return undefined;
      case 'enrollmentNumber':
        if (!value.trim()) return 'Enrollment number is required';
        if (value.trim().length < 3) return 'Enter a valid enrollment number';
        return undefined;
      case 'course':
        if (!value) return 'Please select your course';
        return undefined;
      case 'yearOfStudy':
        if (!value) return 'Please select your year of study';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof RegistrationFormData, value),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof RegistrationFormData, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate all six fields
    const newErrors: ValidationErrors = {};
    (Object.keys(formData) as Array<keyof RegistrationFormData>).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus the first invalid field
      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.getElementsByName(firstErrorField)[0] as HTMLElement | undefined;
      el?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitNotice(null);

    try {
      /**
       * Clean submission function placeholder checking if a backend endpoint exists.
       * If no registration backend is deployed, we store temporarily in localStorage 
       * as a frontend draft placeholder and transparently notify without pretending a remote db was updated.
       */
      let responseOk = false;
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          responseOk = true;
        }
      } catch {
        // No dedicated registration backend endpoint hosted yet
        responseOk = false;
      }

      // Simulated network processing latency for realistic premium feedback
      await new Promise((resolve) => setTimeout(resolve, 850));

      // Save to localStorage as a client-side registration record
      const existing = JSON.parse(localStorage.getItem('csi_registrations') || '[]');
      existing.push({
        ...formData,
        registeredAt: new Date().toISOString(),
      });
      localStorage.setItem('csi_registrations', JSON.stringify(existing));

      if (!responseOk) {
        setSubmitNotice(
          'Client-side placeholder: registration logged locally. Connect an API backend at /api/register when ready.'
        );
      }

      // Show the retro "Vulnerability detected" popup when registration is completed and stored
      setShowVulnerabilityPopup(true);
      setSubmitSuccess(true);
    } catch {
      setErrors({ fullName: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="register"
      aria-label="CSI Student Registration"
      className="relative z-10 min-h-screen w-full border-t border-white/10 bg-[#050505] py-28 sm:py-36 text-[#F4F4F5] overflow-hidden"
    >
      {/* Subtle background ambient particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      />

      {/* Subtle iridescent purple/blue atmospheric background gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[800px] rounded-full bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent blur-[140px]"
      />

      {/* Retro "Vulnerability detected" popup message */}
      <RetroVulnerabilityModal
        isOpen={showVulnerabilityPopup}
        onConfirm={() => setShowVulnerabilityPopup(false)}
        onCancel={() => setShowVulnerabilityPopup(false)}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-12 lg:px-20">
        {/* Section Header with Oversized Editorial Heading */}
        <div className="max-w-4xl">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#f2f2f2]/60">
                Membership Portal · 2026 Intake
              </p>
            </div>

            <h2 className="font-editorial mt-5 text-4xl sm:text-6xl lg:text-7xl font-normal italic tracking-[-0.02em] text-white leading-[1.04] [text-wrap:balance]">
              Become a Part of CSI.
            </h2>

            <p className="mt-5 text-base sm:text-lg lg:text-xl leading-relaxed text-[#f2f2f2]/80 font-sans font-light max-w-3xl">
              Your journey into innovation, technology, and endless possibilities starts here.
            </p>
          </motion.div>
        </div>

        {/* Success View */}
        {submitSuccess ? (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 max-w-2xl rounded-2xl border border-white/15 bg-[#0a0a0c]/90 p-8 sm:p-12 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
              <span className="text-xs uppercase tracking-widest font-mono">
                Registration Confirmed
              </span>
            </div>

            <h3 className="font-editorial mt-6 text-3xl sm:text-4xl italic text-white leading-tight">
              Welcome to CSI. Your journey begins here.
            </h3>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-300 font-sans">
              Thank you, <span className="font-medium text-white">{formData.fullName}</span>. We've
              recorded your enrollment for <span className="text-white">{formData.course}</span> (
              {formData.yearOfStudy}). Updates and orientation details will be delivered to{' '}
              <span className="font-mono text-white text-xs sm:text-sm">{formData.collegeEmail}</span>.
            </p>

            {submitNotice && (
              <p className="mt-5 text-xs text-zinc-400 font-mono border-t border-white/10 pt-4">
                ℹ️ {submitNotice}
              </p>
            )}

            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(false);
                  setFormData({
                    fullName: '',
                    collegeEmail: '',
                    phoneNumber: '',
                    enrollmentNumber: '',
                    course: '',
                    yearOfStudy: '',
                  });
                  setErrors({});
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.05em] text-white transition-all hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Register Another Member</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Registration Form */
          <motion.form
            onSubmit={handleSubmit}
            noValidate
            initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 max-w-5xl"
          >
            {/* Desktop: 2 columns, 3 rows (6 fields total) */}
            <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
              {/* Field 1: Full Name */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col"
              >
                <label
                  htmlFor="fullName"
                  className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300"
                >
                  Full Name <span className="text-purple-400">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Alex Henderson"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={`w-full rounded-2xl border bg-[#0a0a0c]/80 px-6 py-5 text-lg text-white placeholder-zinc-500 backdrop-blur-md transition-all duration-300 focus:outline-none ${
                      errors.fullName
                        ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                        : 'border-white/15 hover:border-white/30 focus:border-white/70 focus:ring-2 focus:ring-purple-400/40 focus:shadow-[0_0_32px_rgba(168,85,247,0.2)]'
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent transition-all duration-300 group-focus-within:via-purple-400/60" />
                </div>
                {errors.fullName && (
                  <p
                    id="fullName-error"
                    className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </motion.div>

              {/* Field 2: College Email ID */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="flex flex-col"
              >
                <label
                  htmlFor="collegeEmail"
                  className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300"
                >
                  College Email ID <span className="text-purple-400">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    id="collegeEmail"
                    name="collegeEmail"
                    value={formData.collegeEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="student@college.edu"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(errors.collegeEmail)}
                    aria-describedby={errors.collegeEmail ? 'collegeEmail-error' : undefined}
                    className={`w-full rounded-2xl border bg-[#0a0a0c]/80 px-6 py-5 text-lg text-white placeholder-zinc-500 backdrop-blur-md transition-all duration-300 focus:outline-none ${
                      errors.collegeEmail
                        ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                        : 'border-white/15 hover:border-white/30 focus:border-white/70 focus:ring-2 focus:ring-purple-400/40 focus:shadow-[0_0_32px_rgba(168,85,247,0.2)]'
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent transition-all duration-300 group-focus-within:via-purple-400/60" />
                </div>
                {errors.collegeEmail && (
                  <p
                    id="collegeEmail-error"
                    className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.collegeEmail}</span>
                  </p>
                )}
              </motion.div>

              {/* Field 3: Phone Number */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.26 }}
                className="flex flex-col"
              >
                <label
                  htmlFor="phoneNumber"
                  className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300"
                >
                  Phone Number (Indian 10-Digit) <span className="text-purple-400">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="9876543210"
                    autoComplete="tel"
                    required
                    maxLength={13}
                    aria-invalid={Boolean(errors.phoneNumber)}
                    aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                    className={`w-full rounded-2xl border bg-[#0a0a0c]/80 px-6 py-5 text-lg text-white placeholder-zinc-500 backdrop-blur-md transition-all duration-300 focus:outline-none ${
                      errors.phoneNumber
                        ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                        : 'border-white/15 hover:border-white/30 focus:border-white/70 focus:ring-2 focus:ring-purple-400/40 focus:shadow-[0_0_32px_rgba(168,85,247,0.2)]'
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent transition-all duration-300 group-focus-within:via-purple-400/60" />
                </div>
                {errors.phoneNumber && (
                  <p
                    id="phoneNumber-error"
                    className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.phoneNumber}</span>
                  </p>
                )}
              </motion.div>

              {/* Field 4: Enrollment Number */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.34 }}
                className="flex flex-col"
              >
                <label
                  htmlFor="enrollmentNumber"
                  className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300"
                >
                  Enrollment Number <span className="text-purple-400">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="enrollmentNumber"
                    name="enrollmentNumber"
                    value={formData.enrollmentNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 0241CS211045"
                    required
                    aria-invalid={Boolean(errors.enrollmentNumber)}
                    aria-describedby={errors.enrollmentNumber ? 'enrollmentNumber-error' : undefined}
                    className={`w-full rounded-2xl border bg-[#0a0a0c]/80 px-6 py-5 text-lg text-white placeholder-zinc-500 backdrop-blur-md transition-all duration-300 focus:outline-none ${
                      errors.enrollmentNumber
                        ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                        : 'border-white/15 hover:border-white/30 focus:border-white/70 focus:ring-2 focus:ring-purple-400/40 focus:shadow-[0_0_32px_rgba(168,85,247,0.2)]'
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent transition-all duration-300 group-focus-within:via-purple-400/60" />
                </div>
                {errors.enrollmentNumber && (
                  <p
                    id="enrollmentNumber-error"
                    className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.enrollmentNumber}</span>
                  </p>
                )}
              </motion.div>

              {/* Field 5: Course */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.42 }}
                className="flex flex-col"
              >
                <label
                  htmlFor="course"
                  className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300"
                >
                  Course <span className="text-purple-400">*</span>
                </label>
                <div className="relative group">
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={Boolean(errors.course)}
                    aria-describedby={errors.course ? 'course-error' : undefined}
                    className={`w-full appearance-none rounded-2xl border bg-[#0a0a0c]/80 px-6 py-5 text-lg text-white backdrop-blur-md transition-all duration-300 focus:outline-none cursor-pointer ${
                      errors.course
                        ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                        : 'border-white/15 hover:border-white/30 focus:border-white/70 focus:ring-2 focus:ring-purple-400/40 focus:shadow-[0_0_32px_rgba(168,85,247,0.2)]'
                    } ${!formData.course ? 'text-zinc-500' : 'text-white'}`}
                  >
                    <option value="" disabled className="bg-[#0a0a0c] text-zinc-500">
                      Select your degree / course
                    </option>
                    {COURSES.map((c) => (
                      <option key={c} value={c} className="bg-[#0a0a0c] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent transition-all duration-300 group-focus-within:via-purple-400/60" />
                </div>
                {errors.course && (
                  <p
                    id="course-error"
                    className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.course}</span>
                  </p>
                )}
              </motion.div>

              {/* Field 6: Year of Study */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col"
              >
                <label
                  htmlFor="yearOfStudy"
                  className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300"
                >
                  Year of Study <span className="text-purple-400">*</span>
                </label>
                <div className="relative group">
                  <select
                    id="yearOfStudy"
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={Boolean(errors.yearOfStudy)}
                    aria-describedby={errors.yearOfStudy ? 'yearOfStudy-error' : undefined}
                    className={`w-full appearance-none rounded-2xl border bg-[#0a0a0c]/80 px-6 py-5 text-lg text-white backdrop-blur-md transition-all duration-300 focus:outline-none cursor-pointer ${
                      errors.yearOfStudy
                        ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                        : 'border-white/15 hover:border-white/30 focus:border-white/70 focus:ring-2 focus:ring-purple-400/40 focus:shadow-[0_0_32px_rgba(168,85,247,0.2)]'
                    } ${!formData.yearOfStudy ? 'text-zinc-500' : 'text-white'}`}
                  >
                    <option value="" disabled className="bg-[#0a0a0c] text-zinc-500">
                      Select your current academic year
                    </option>
                    {YEARS_OF_STUDY.map((y) => (
                      <option key={y} value={y} className="bg-[#0a0a0c] text-white">
                        {y}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent transition-all duration-300 group-focus-within:via-purple-400/60" />
                </div>
                {errors.yearOfStudy && (
                  <p
                    id="yearOfStudy-error"
                    className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.yearOfStudy}</span>
                  </p>
                )}
              </motion.div>
            </div>

            {/* Privacy notice explaining how data will be used */}
            <p className="mt-10 text-xs sm:text-sm leading-relaxed text-zinc-400">
              <span className="text-zinc-300 font-semibold">Privacy Notice:</span> Your registration
              details (name, email, contact, and academic credentials) will be used solely for CSI
              Student Chapter operations, workshops, project cohorts, and official announcements. We
              never sell or share your data with external third parties.
            </p>

            {/* Centered Registration Button */}
            <div className="mt-12 flex flex-col items-center justify-center">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                className="group relative inline-flex items-center justify-center gap-4 rounded-full border border-white/35 bg-[#0a0a0c] px-12 py-5 text-sm font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_6px_30px_rgba(0,0,0,0.6)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Validating & Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Register</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </motion.button>
            </div>

            {/* Sentinel marking the exact end/bottom of the registration section */}
            <div
              id="registration-end-sentinel"
              aria-hidden="true"
              className="pointer-events-none h-px w-full mt-4"
            />
          </motion.form>
        )}
      </div>
    </section>
  );
};
