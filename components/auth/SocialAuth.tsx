import { FaGithub, FaGoogle } from "react-icons/fa";
import Button from "../common/Button";
import { signIn } from "next-auth/react";

const SocialAuth = () => {
  const handleOnClick = (provider: "google" | "github") => {
    signIn(provider);
  };

  return (
    <div className="flex gap-2 flex-col">
      <Button
        type="button"
        label="Continue With Github"
        outlined
        icon={FaGithub}
        onClick={() => handleOnClick("github")}
      />
      <Button
        type="button"
        label="Continue With Google"
        outlined
        icon={FaGoogle}
        onClick={() => handleOnClick("google")}
      />
    </div>
  );
};

export default SocialAuth;
