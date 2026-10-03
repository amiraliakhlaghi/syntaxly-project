import LoginForm from "@/components/auth/LoginForm";
import AuthModal from "@/components/layout/AuthModal";

const Login = () => {
  return (
    <AuthModal>
      <LoginForm />
    </AuthModal>
  );
};

export default Login;
