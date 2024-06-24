import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUser } from "lucide-react";

type Props = {
  userImage: string;
  className?: string;
};

export default function UserAvatar({ userImage, className }: Props) {
  return (
    <Avatar className={`size-7 ${className}`}>
      <AvatarImage src={userImage} alt="User avatar" />
      <AvatarFallback className="bg-slate-900">
        <CircleUser className="text-white" />
      </AvatarFallback>
    </Avatar>
  );
}
