import RegisterForm from "@/components/auth/RegisterForm";
import AuthModal from "@/components/layout/AuthModal";

const Register = () => {
  return (
    <AuthModal>
      <RegisterForm />
    </AuthModal>
  );
};

export default Register;
