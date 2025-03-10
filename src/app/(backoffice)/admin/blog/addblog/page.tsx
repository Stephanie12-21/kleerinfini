// "use client";

// import React, { useState } from "react";
// import { X } from "lucide-react";
// import Image from "next/image";

// import { useRouter } from "next/navigation";
// import RichTextEditor from "@/components/TextEditor/RichEditor";

// const ArticleForm = () => {
//   const [titre, setTitre] = useState("");
//   const [contenu, setContenu] = useState({});
//   const [categorieArticle, setCategorieArticle] = useState("");
//   const [imageFiles, setImageFiles] = useState([]);
//   const router = useRouter();

//   const resetForm = () => {
//     setTitre("");
//     setContenu({});
//     setCategorieArticle("");
//     setImageFiles([]);
//   };

//   const handleImageUpload = (e) => {
//     const newFiles = Array.from(e.target.files);
//     setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
//   };

//   const removeImage = (index) => {
//     setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!titre || !contenu || !categorieArticle) {
//       alert("Tous les champs doivent être remplis ");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("titre", titre);
//     formData.append("contenu", JSON.stringify(contenu));
//     formData.append("categorieArticle", categorieArticle);
//     imageFiles.forEach((file) => {
//       formData.append("images", file);
//     });

//     try {
//       const response = await fetch("/api/blog", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert("ajout réussi");

//         resetForm();

//         setTimeout(() => {
//           router.push("/admin/blog");
//         }, 5000);
//       } else {
//         alert("erreur");
//       }
//     } catch (error) {
//       alert("Erreur lors de la soumission :", error);
//     }
//   };

//   return (
//     <div className="max-w-6xl container  mx-auto px-4 py-8 bg-white shadow-md my-5 rounded-lg">
//       <h1 className="text-4xl font-bold mb-8 text-center">
//         Ajouter une nouvelle annonce
//       </h1>
//       <div className="flex-col space-y-3">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div>
//               <label
//                 htmlFor="titre"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Titre
//               </label>
//               <input
//                 type="text"
//                 id="titre"
//                 value={titre}
//                 onChange={(e) => setTitre(e.target.value)}
//                 required
//                 className="mt-1"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="categorieArticle"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Catégorie
//               </label>
//               <input
//                 type="text"
//                 id="categorieArticle"
//                 value={categorieArticle}
//                 onChange={(e) => setCategorieArticle(e.target.value)}
//                 required
//                 className="mt-1"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="contenu"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Contenu
//               </label>
//               <RichTextEditor
//                 content={contenu}
//                 onChange={(json) => setContenu(json)}
//               />
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label
//                 htmlFor="imageFiles"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Choisir des images
//               </label>
//               <input
//                 type="file"
//                 id="imageFiles"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageUpload}
//                 className="mt-1"
//               />
//             </div>
//             {imageFiles.length > 0 && (
//               <div className="mt-4">
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   Images sélectionnées :
//                 </h3>
//                 <div className="grid grid-cols-4 gap-4">
//                   {imageFiles.map((file, index) => {
//                     const fileURL = URL.createObjectURL(file);

//                     return (
//                       <div key={index} className="relative group">
//                         <Image
//                           src={fileURL}
//                           alt={`Image ${index + 1}`}
//                           width={100}
//                           height={70}
//                           className="w-28 h-20 object-cover rounded"
//                         />
//                         <button
//                           type="button"
//                           className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
//                           onClick={() => removeImage(index)}
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="space-y-3">
//           <div className="flex justify-between w-full space-x-9">
//             <button
//               className=" text-white p-2 rounded w-full"
//               onClick={handleSubmit}
//             >
//               Ajouter le nouvel article
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArticleForm;
import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
