import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorBoundary: React.FC = () => {
  const error = useRouteError() as Error | { status?: number; statusText?: string };

  console.error(error);

  const isHttpError = (err: any): err is { status: number; statusText?: string } => {
    return err && typeof err === "object" && "status" in err;
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">متاسفیم، خطایی رخ داده!</h1>
      <p className="mb-4">
        {isHttpError(error)
          ? `کد خطا: ${error.status} - ${error.statusText || "خطای ناشناخته"}`
          : (error as Error).message || "یک خطای غیرمنتظره پیش آمده است."}
      </p>
      <a href="/" className="text-blue-600 underline">
        بازگشت به صفحه اصلی
      </a>
    </div>
  );
};

export default ErrorBoundary;
