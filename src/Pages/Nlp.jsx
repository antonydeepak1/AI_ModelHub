import React from "react";
import { Link } from "react-router-dom";
import { Mic, Smile } from "lucide-react";

const models = [
  {
    title: "Comedy Generator (NLP)",
    description: "Generate comedy scripts using NLP based on any topic or context.",
    icon: <Smile className="w-6 h-6 text-primary" />,
    image: "/images/comedy_nlp.jpg", // Replace with your image path
    route: "/comedy-nlp", // Link to your NLP comedy generator page
    tag: "NLP"
  },
  {
    title: "ATS Resume Enhancer (NLP)",
    description: "Enhance your resume with NLP to make it ATS-compatible and improve job chances.",
    icon: <Mic className="w-6 h-6 text-primary" />,
    image: "/images/resume_nlp.jpg", // Replace with your image path
    route: "/resume-nlp", // Link to your resume enhancer page
    tag: "NLP"
  }
];

const Nlp = () => {
  return (
    <div className="p-10 max-w-7xl mx-auto font-urbanist">
      {/* Gradient Heading */}
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-black via-purple-700 to-indigo-400 mb-4">
        Explore NLP Models
      </h1>

      <p className="text-gray-600 dark:text-gray-300 text-center mb-10">
        Click on any card to try the tool
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {models.map((model, index) => (
          <Link to={model.route} key={index}>
            <div className="relative rounded-xl overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-300">
              <img
                src={model.image}
                alt={model.title}
                className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 text-xs font-semibold text-primary shadow">
                {model.tag}
              </div>

              <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm group-hover:bg-opacity-50 transition-all duration-300"></div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex items-center gap-2 mb-1">
                  {model.icon}
                  {/* Gradient Text Title */}
                  <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-black via-indigo-400 to-fuchsia-500">
                    {model.title}
                  </h2>
                </div>
                <p className="text-sm text-gray-200">{model.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Nlp;
