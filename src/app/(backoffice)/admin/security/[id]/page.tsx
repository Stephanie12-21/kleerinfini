"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordChangeForm: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setStep(1);
    setError("");
    setSuccess(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError("Impossible de récupérer l'ID de l'utilisateur.");
      return;
    }

    if (step === 1) {
      if (!formData.currentPassword) {
        setError("Le mot de passe actuel est requis");

        return;
      }
      try {
        const response = await fetch("/api/profile/verifyPswrd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: id,
            currentPassword: formData.currentPassword,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setStep(2);
          setError("");
        } else {
          setError(data.error || "Le mot de passe actuel est incorrect");
        }
      } catch {
        setError(
          "Une erreur est survenue lors de la vérification du mot de passe"
        );
      }
    } else if (step === 2) {
      console.log("id reçu :", id);
      alert("identifiant concerné :" + id);
      if (!formData.newPassword || !formData.confirmPassword) {
        setError("Tous les champs sont obligatoires");

        return;
      }
      if (formData.newPassword.length < 8) {
        setError("Le nouveau mot de passe doit contenir au moins 8 caractères");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Les nouveaux mots de passe ne correspondent pas");
        return;
      }
      try {
        const response = await fetch(`/api/profile/modifyPswrd/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: formData.newPassword }),
        });
        if (response.ok) {
          setSuccess(true);
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setTimeout(() => router.push("/admin"), 5000);
        } else {
          setError("Erreur lors de la modification du mot de passe");
        }
      } catch {
        setError(
          "Une erreur est survenue lors de la modification du mot de passe"
        );
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Modifier le mot de passe
      </h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {success && (
        <div className="mb-4 bg-green-50 text-green-700 border-green-200 p-3">
          <CheckCircle2 className="h-4 w-4 inline-block mr-2" />
          Votre mot de passe a été modifié avec succès. Redirection en cours...
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div>
            <label htmlFor="currentPassword">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <>
            <div>
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <button type="submit" className="w-full">
          <Lock className="mr-2 h-4 w-4" />{" "}
          {step === 1 ? "Vérifier mot de passe" : "Modifier le mot de passe"}
        </button>
        {step === 2 && (
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        )}
      </form>
    </div>
  );
};

export default PasswordChangeForm;
