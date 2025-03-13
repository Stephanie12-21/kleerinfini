"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Loader2, TagIcon, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Image from "next/image";

interface Article {
  titre: string;
  categorieArticle: string;
  contenu: string;
  images: { path: string }[];
  createdAt: string;
}

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>; // `params` est une promesse
}

const ArticleDetailPage = ({ params }: ArticleDetailPageProps) => {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    async function getId() {
      const resolvedParams = await params; // Attendre que `params` soit résolu
      setId(resolvedParams.id); // Mettre à jour l'ID après la résolution
    }

    getId();
  }, [params]);

  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setLightboxOpen] = useState(false);

  const remainingImages = images.slice(1);
  const remainingCount = remainingImages.length;

  useEffect(() => {
    if (!id) return;

    async function fetchAnnonce() {
      try {
        const response = await fetch(`/api/blog/${id}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
          setTitle(data.titre);
          setCategory(data.categorieArticle);
          setDescription(data.contenu);
          setImages(data.images.map((image: { path: string }) => image.path));
        } else {
          console.error("Article non trouvé avec l'id annonce :", id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'annonce :", error);
        setError("Erreur lors de la récupération de l'annonce.");
      }
    }

    fetchAnnonce();
  }, [id]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!article) {
    return (
      <div className="w-full max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md text-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">
          Chargement de l&apos;article en cours...
        </p>
        <p className="text-sm text-gray-500">
          Veuillez patienter quelques instants.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="flex justify-between items-center bg-primary p-6">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
              {new Date(article.createdAt).toLocaleString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-gray-700">à</span>
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
              {new Date(article.createdAt).toLocaleString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <TagIcon className="text-blue-500 h-6 w-6" />
                <p className="font-semibold text-gray-700">
                  <strong>Catégorie:</strong> {category}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <div
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html:
                      description.replace(/^"|"$/g, "") ||
                      "<p>Contenu non disponible.</p>",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ImageIcon className="text-purple-500 h-6 w-6" />
                <h3 className="text-xl font-semibold">Images</h3>
              </div>
              {article.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {article.images[0]?.path && (
                    <div onClick={() => openLightbox(0)}>
                      <Image
                        src={article.images[0].path}
                        alt="First Image"
                        width={800}
                        height={600}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "400px",
                          objectFit: "cover",
                          cursor: "pointer",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  )}

                  {remainingCount > 0 && (
                    <div
                      className="flex items-center justify-center p-4 bg-gray-200 cursor-pointer rounded-lg"
                      onClick={() => openLightbox(0)}
                    >
                      <p className="text-gray-700">
                        +{remainingCount}{" "}
                        {remainingCount > 1 ? "autres photos" : "autre photo"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Aucune image disponible</p>
              )}
            </div>

            {isLightboxOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
                style={{
                  backdropFilter: "blur(10px)",
                  margin: 0,
                  padding: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  boxSizing: "border-box",
                }}
              >
                <Swiper
                  spaceBetween={20}
                  slidesPerView={1}
                  className="w-full max-w-3xl"
                  initialSlide={currentIndex}
                  onSlideChange={(swiper) =>
                    setCurrentIndex(swiper.activeIndex)
                  }
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        width={1200}
                        height={900}
                        style={{
                          maxWidth: "90%",
                          maxHeight: "90vh",
                          objectFit: "contain",
                          borderRadius: "10px",
                          margin: "auto",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button
                  className="absolute top-4 right-4 hover:bg-[#9B9B9B] text-white p-2 rounded-full"
                  onClick={() => setLightboxOpen(false)}
                >
                  <X />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
