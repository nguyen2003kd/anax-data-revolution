"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { 
  Tag, 
  Code, 
  FolderOpen, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Send,
  Loader2,
  ArrowUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// Validation Schema
const formSchema = z.object({
  id: z.number(),
  tag: z.string().min(1, "Tag không được để trống"),
  code: z.string().min(1, "Code không được để trống"),
  category: z.string().min(1, "Category không được để trống"),
  title: z.string().min(1, "Title không được để trống"),
  date: z.string().min(1, "Ngày không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
});

type FormData = z.infer<typeof formSchema>;

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [form, setForm] = useState<FormData>({
    id: 0,
    tag: "",
    code: "",
    category: "",
    title: "",
    date: "",
    description: "",
    content: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Back to top function
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const validateForm = (): boolean => {
    try {
      formSchema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormData;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSend = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
  
    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycby9iEIsY0gRLG0R57RCO2QPmhJu4A-aHz9pKJcT5bPg-xv7KH61j4sVaLA6W96F6WLG7g/exec", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(form),
      });
  
      const result = await res.json();
      console.log("✅ Kết quả:", result);
      setShowSuccess(true);
      setForm({
        id: 0,
        tag: "",
        code: "",
        category: "",
        title: "",
        date: "",
        description: "",
        content: "",
      });
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("❌ Lỗi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render error message
  const renderError = (field: keyof FormData) => {
    if (errors[field]) {
      return (
        <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
          <AlertCircle className="w-4 h-4" />
          <span>{errors[field]}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Success Notification */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        showSuccess ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-medium text-green-800">Thành công!</p>
            <p className="text-sm text-green-600">Dữ liệu đã được thêm vào hệ thống.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Nhập dữ liệu
          </h1>
          <p className="text-gray-600 text-lg">
            Điền thông tin để thêm dữ liệu mới vào hệ thống
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tag Field */}
            <div className="space-y-2">
              <label htmlFor="tag" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4 text-blue-500" />
                Tag
              </label>
              <input 
                id="tag"
                name="tag" 
                placeholder="Nhập tag..." 
                value={form.tag} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 border ${errors.tag ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black bg-white`}
              />
              {renderError('tag')}
            </div>

            {/* Code Field */}
            <div className="space-y-2">
              <label htmlFor="code" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Code className="w-4 h-4 text-green-500" />
                Code
              </label>
              <input 
                id="code"
                name="code" 
                placeholder="Nhập code..." 
                value={form.code} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 border ${errors.code ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-black bg-white`}
              />
              {renderError('code')}
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FolderOpen className="w-4 h-4 text-purple-500" />
                Category
              </label>
              <input 
                id="category"
                name="category" 
                placeholder="Nhập category..." 
                value={form.category} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 border ${errors.category ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black bg-white`}
              />
              {renderError('category')}
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 text-orange-500" />
                Title
              </label>
              <input 
                id="title"
                name="title" 
                placeholder="Nhập title..." 
                value={form.title} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-black bg-white`}
              />
              {renderError('title')}
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <label htmlFor="date" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-red-500" />
                Ngày
              </label>
              <input 
                id="date"
                type="date" 
                name="date" 
                value={form.date} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 border ${errors.date ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-black bg-white`}
              />
              {renderError('date')}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                Mô tả
              </label>
              <input 
                id="description"
                name="description" 
                placeholder="Nhập mô tả..." 
                value={form.description} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-black bg-white`}
              />
              {renderError('description')}
            </div>
          </div>

          {/* Content Field - Full Width */}
          <div className="space-y-2 mb-8">
            <label htmlFor="content" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4 text-teal-500" />
              Nội dung
            </label>
            <textarea 
              id="content"
              name="content" 
              placeholder="Nhập nội dung..." 
              value={form.content} 
              onChange={handleChange} 
              rows={6}
              className={`w-full px-4 py-3 border ${errors.content ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-black bg-white resize-none`}
            />
            {renderError('content')}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleSend} 
              disabled={isLoading}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              )}
              {isLoading ? "Đang gửi..." : "Thêm dữ liệu"}
            </button>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={handleBackToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 z-50 ${
          showBackToTop 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Quay về đầu trang"
        title="Quay về đầu trang"
      >
        <ArrowUp className="w-6 h-6 mx-auto" />
      </button>
    </div>
  );
}
