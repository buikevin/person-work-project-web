import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "../../contexts/ThemeContext";
import { useCreateProject } from "../../hooks/useProjects";
import { mapLocalToCreateProjectInput } from "../../utils/projectMappers";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, ArrowRight, Loader2, Upload, Check } from "lucide-react";
import { cn } from "../../lib/utils";

// Schemas for each step
const step1Schema = z.object({
  name: z
    .string()
    .min(3, "Tên dự án phải có ít nhất 3 ký tự")
    .max(50, "Tên dự án không được vượt quá 50 ký tự"),
  slug: z
    .string()
    .min(3, "Slug phải có ít nhất 3 ký tự")
    .max(30, "Slug không được vượt quá 30 ký tự")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"
    ),
  description: z
    .string()
    .max(200, "Mô tả không được vượt quá 200 ký tự")
    .optional(),
  image: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0]?.size <= 5 * 1024 * 1024; // 5MB
    }, "Kích thước file không được vượt quá 5MB")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      const acceptedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      return acceptedTypes.includes(files[0]?.type);
    }, "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)"),
});

const step2Schema = z.object({
  backendLanguage: z.enum(["java", "nestjs", "python"]),
  architecture: z.enum(["microservice", "mono"]),
  database: z.enum(["mongodb", "postgresql", "mysql"]),
  apiType: z.enum(["graphql", "restful"]),
});

const step3Schema = z.object({
  framework: z.enum(["vite", "nextjs", "vuejs", "angular"]),
  viteType: z.enum(["vite-react", "vite-vuejs"]).optional(),
  frontendArchitecture: z.enum(["micro-frontend", "spa", "ssr"]),
}).refine((data) => {
  // Nếu framework là "vite" thì viteType là bắt buộc
  if (data.framework === "vite") {
    return data.viteType !== undefined;
  }
  return true;
}, {
  message: "Vui lòng chọn loại Vite khi sử dụng framework Vite",
  path: ["viteType"],
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type FormData = Step1Data & Step2Data & Step3Data;

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { createProject, loading: isCreating, error: createError } = useCreateProject();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Store data from all steps
  const [formData, setFormData] = useState<Partial<FormData>>({
    backendLanguage: "nestjs",
    architecture: "mono",
    database: "mongodb",
    apiType: "restful",
    framework: "vite",
    frontendArchitecture: "spa",
  });

  // Step 1 form
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: undefined,
    },
  });

  // Step 2 form
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      backendLanguage: "nestjs",
      architecture: "mono",
      database: "mongodb",
      apiType: "restful",
    },
  });

  // Step 3 form
  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      framework: "vite",
      frontendArchitecture: "spa",
    },
  });

  // Helper function to generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleStep1Submit = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Submit = async (data: Step3Data) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      const finalData = { ...formData, ...data };

      // Tạo metadata object từ form data
      const metadata = {
        backend: finalData.backendLanguage,
        frontend: finalData.framework === 'vite' ? finalData.viteType : finalData.framework,
        database: finalData.database,
        framework: finalData.framework,
        transparent: finalData.architecture, // architecture -> transparent
      };

      // Map data để tạo project qua GraphQL
      const projectData = mapLocalToCreateProjectInput({
        name: finalData.name!,
        slug: finalData.slug!,
        description: finalData.description || undefined,
        avatar: undefined, // TODO: Handle image upload
        metadata
      });

      // Gọi GraphQL mutation
      const result = await createProject(projectData);

      if (result.success && result.data) {
        // Navigate to project detail with real ID
        navigate(`/projects/${result.data._id}`);
      } else {
        setFormError(result.error || 'Có lỗi xảy ra khi tạo dự án');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo dự án";
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    step1Form.setValue("slug", slug);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      step1Form.setValue("image", files);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
      step1Form.setValue("image", undefined);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step < currentStep
                  ? "bg-green-500 text-white"
                  : step === currentStep
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600",
                isDarkMode && step === currentStep && "dark:bg-blue-600",
                isDarkMode && step > currentStep && "dark:bg-gray-700 dark:text-gray-300"
              )}
            >
              {step < currentStep ? <Check className="h-4 w-4" /> : step}
            </div>
            {step < 3 && (
              <div
                className={cn(
                  "w-12 h-1 mx-2",
                  step < currentStep ? "bg-green-500" : "bg-gray-200",
                  isDarkMode && step >= currentStep && "dark:bg-gray-700"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bước 1: Thông tin cơ bản</CardTitle>
        <CardDescription>
          Nhập thông tin cơ bản cho dự án của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={step1Form.handleSubmit(handleStep1Submit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên dự án *</Label>
                <Input
                  id="name"
                  placeholder="Nhập tên dự án"
                  {...step1Form.register("name", {
                    onChange: handleNameChange,
                  })}
                  className={
                    step1Form.formState.errors.name ? "border-red-500" : ""
                  }
                />
                {step1Form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {step1Form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="slug-du-an"
                  {...step1Form.register("slug")}
                  className={
                    step1Form.formState.errors.slug ? "border-red-500" : ""
                  }
                />
                {step1Form.formState.errors.slug && (
                  <p className="text-sm text-red-500">
                    {step1Form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <textarea
                  id="description"
                  placeholder="Mô tả ngắn gọn về dự án..."
                  rows={3}
                  {...step1Form.register("description")}
                  className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    step1Form.formState.errors.description
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {step1Form.formState.errors.description && (
                  <p className="text-sm text-red-500">
                    {step1Form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Hình ảnh dự án</Label>
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    {...step1Form.register("image", {
                      onChange: handleImageChange,
                    })}
                    className={`file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                      step1Form.formState.errors.image ? "border-red-500" : ""
                    }`}
                  />
                  {selectedFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">File đã chọn:</span>{" "}
                      {selectedFile.name}
                      <span className="ml-2 text-gray-400">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>
                {step1Form.formState.errors.image && (
                  <p className="text-sm text-red-500">
                    {step1Form.formState.errors.image.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Xem trước</Label>
              <div className={cn("bg-white rounded-lg border border-gray-200 overflow-hidden", isDarkMode && "dark:bg-gray-800 dark:border-gray-700")}>
                <div className={cn("h-32 bg-gray-100 flex items-center justify-center", isDarkMode && "dark:bg-gray-700")}>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={cn("flex flex-col items-center justify-center h-full text-gray-400", isDarkMode && "dark:text-gray-500")}>
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-xs">Chọn hình ảnh</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className={cn("font-medium text-sm text-gray-900 truncate", isDarkMode && "dark:text-white")}>
                    {step1Form.watch("name") || "Tên dự án"}
                  </h3>
                  <p className={cn("text-xs text-gray-500 font-mono", isDarkMode && "dark:text-gray-400")}>
                    /{step1Form.watch("slug") || "slug"}
                  </p>
                  <p className={cn("text-xs text-gray-400 mt-1 line-clamp-2", isDarkMode && "dark:text-gray-500")}>
                    {step1Form.watch("description") || "Mô tả dự án..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/projects")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              Tiếp tục
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bước 2: Cấu hình Backend</CardTitle>
        <CardDescription>
          Chọn công nghệ backend cho dự án của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={step2Form.handleSubmit(handleStep2Submit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Ngôn ngữ Backend *</Label>
              <div className="grid grid-cols-3 gap-3">
                {["java", "nestjs", "python"].map((lang) => (
                  <label key={lang} className="cursor-pointer">
                    <input
                      type="radio"
                      value={lang}
                      {...step2Form.register("backendLanguage")}
                      className="sr-only peer"
                    />
                    <div className={cn("p-3 border-2 rounded-lg text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50", isDarkMode && "dark:border-gray-600 dark:peer-checked:border-blue-400 dark:peer-checked:bg-blue-900/20 dark:hover:bg-gray-700")}>
                      <div className={cn("font-medium capitalize", isDarkMode && "dark:text-white")}>{lang}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Mô hình kiến trúc *</Label>
              <div className="grid grid-cols-2 gap-3">
                {["mono", "microservice"].map((arch) => (
                  <label key={arch} className="cursor-pointer">
                    <input
                      type="radio"
                      value={arch}
                      {...step2Form.register("architecture")}
                      className="sr-only peer"
                    />
                    <div className={cn("p-3 border-2 rounded-lg text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50", isDarkMode && "dark:border-gray-600 dark:peer-checked:border-blue-400 dark:peer-checked:bg-blue-900/20 dark:hover:bg-gray-700")}>
                      <div className={cn("font-medium capitalize", isDarkMode && "dark:text-white")}>
                        {arch === "mono" ? "Monolithic" : "Microservice"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Cơ sở dữ liệu *</Label>
              <div className="grid grid-cols-3 gap-3">
                {["mongodb", "postgresql", "mysql"].map((db) => (
                  <label key={db} className="cursor-pointer">
                    <input
                      type="radio"
                      value={db}
                      {...step2Form.register("database")}
                      className="sr-only peer"
                    />
                    <div className={cn("p-3 border-2 rounded-lg text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50", isDarkMode && "dark:border-gray-600 dark:peer-checked:border-blue-400 dark:peer-checked:bg-blue-900/20 dark:hover:bg-gray-700")}>
                      <div className={cn("font-medium capitalize", isDarkMode && "dark:text-white")}>
                        {db === "postgresql" ? "PostgreSQL" : db}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Loại API *</Label>
              <div className="grid grid-cols-2 gap-3">
                {["restful", "graphql"].map((api) => (
                  <label key={api} className="cursor-pointer">
                    <input
                      type="radio"
                      value={api}
                      {...step2Form.register("apiType")}
                      className="sr-only peer"
                    />
                    <div className={cn("p-3 border-2 rounded-lg text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50", isDarkMode && "dark:border-gray-600 dark:peer-checked:border-blue-400 dark:peer-checked:bg-blue-900/20 dark:hover:bg-gray-700")}>
                      <div className={cn("font-medium uppercase", isDarkMode && "dark:text-white")}>{api}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setCurrentStep(1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <Button type="submit" className="flex-1">
              Tiếp tục
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bước 3: Cấu hình Frontend</CardTitle>
        <CardDescription>Chọn framework và kiến trúc frontend</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={step3Form.handleSubmit(handleStep3Submit)}
          className="space-y-6"
        >
          {formError && (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Framework Frontend *</Label>
              <div className="grid grid-cols-2 gap-3">
                {["vite", "nextjs", "vuejs", "angular"].map((framework) => (
                  <label key={framework} className="cursor-pointer">
                    <input
                      type="radio"
                      value={framework}
                      {...step3Form.register("framework")}
                      className="sr-only peer"
                    />
                    <div className={cn("p-3 border-2 rounded-lg text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50", isDarkMode && "dark:border-gray-600 dark:peer-checked:border-blue-400 dark:peer-checked:bg-blue-900/20 dark:hover:bg-gray-700")}>
                      <div className={cn("font-medium capitalize", isDarkMode && "dark:text-white")}>
                        {framework === "nextjs"
                          ? "Next.js"
                          : framework === "vuejs"
                          ? "Vue.js"
                          : framework}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {step3Form.watch("framework") === "vite" && (
              <div className="space-y-3">
                <Label>Loại Vite *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["vite-react", "vite-vuejs"].map((viteType) => (
                    <label key={viteType} className="cursor-pointer">
                      <input
                        type="radio"
                        value={viteType}
                        {...step3Form.register("viteType")}
                        className="sr-only peer"
                      />
                      <div className={cn("p-3 border-2 rounded-lg text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50", isDarkMode && "dark:border-gray-600 dark:peer-checked:border-blue-400 dark:peer-checked:bg-blue-900/20 dark:hover:bg-gray-700")}>
                        <div className={cn("font-medium", isDarkMode && "dark:text-white")}>
                          {viteType === "vite-react"
                            ? "Vite + React"
                            : "Vite + Vue.js"}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {step3Form.formState.errors.viteType && (
                  <p className="text-sm text-red-500">
                    {step3Form.formState.errors.viteType.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <Label>Mô hình Frontend *</Label>
              <div className="grid grid-cols-3 gap-3">
                {["spa", "ssr", "micro-frontend"].map((arch) => (
                  <label key={arch} className="cursor-pointer">
                    <input
                      type="radio"
                      value={arch}
                      {...step3Form.register("frontendArchitecture")}
                      className="sr-only peer"
                    />
                    <div className={cn("p-3 border-2 rounded-lg text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50", isDarkMode && "dark:border-gray-600 dark:peer-checked:border-blue-400 dark:peer-checked:bg-blue-900/20 dark:hover:bg-gray-700")}>
                      <div className={cn("font-medium uppercase", isDarkMode && "dark:text-white")}>{arch}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setCurrentStep(2)}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isCreating}
              className="flex-1"
            >
              {(isSubmitting || isCreating) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang khởi tạo...
                </>
              ) : (
                "Khởi tạo dự án"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("h-full flex flex-col bg-gray-50", isDarkMode && "dark:bg-gray-900")}>
      {/* Header */}
      <header className={cn("bg-white border-b border-gray-200 flex-shrink-0", isDarkMode && "dark:bg-gray-800 dark:border-gray-700")}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => navigate("/projects")}
              variant="ghost"
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <h1 className={cn("text-xl font-semibold text-gray-900", isDarkMode && "dark:text-white")}>
              Tạo dự án mới
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderStepIndicator()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
