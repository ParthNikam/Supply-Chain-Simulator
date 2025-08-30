
import GoogleLoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <div className="w-full font-sans justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Supply Chain Simulator</h1>
      <GoogleLoginForm/>
    </div>
  );
}
