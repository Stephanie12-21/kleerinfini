"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import * as z from "zod";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const emailLoginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit comporter au moins 8 caractères"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      emailLoginSchema.parse(formData);

      const loginData = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginData?.error) {
        setErrors({ form: "Identifiants incorrects" });
        setIsSubmitting(false);
        return;
      }

      const session = await getSession();
      if (session) {
        router.push("/admin");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ form: "Une erreur est survenue, veuillez réessayer." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="  text-center text-3xl font-extrabold text-indigo-900 mb-2">
          Connexion
        </h2>
        {errors.form && (
          <p className="text-red-500 text-sm mb-3">{errors.form}</p>
        )}
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-4 py-3 rounded-xl text-gray-900 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500
             shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full px-4 py-3 rounded-xl text-gray-900 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500
             shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div className=" mt-4 space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>

          <button
            type="button"
            onClick={handleGoSignUp}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            S&apos;inscrire
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
