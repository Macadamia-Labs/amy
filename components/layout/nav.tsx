import { App } from "@/lib/types/apps";
import { NavNewChat } from "../../layout/nav-new-chat";
import { NavChats } from "../../layout/nav-chats";

export function NavCooper() {
  return (
    <>
      <NavNewChat app={App.Cooper} />
      <NavChats app={App.Cooper} />
    </>
  );
}
