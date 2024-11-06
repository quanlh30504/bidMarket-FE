import { Sidebar } from "../../admin/Sidebar";
import { Container } from "../Design";
import { useUser } from "../../../router";

export const DashboardLayout = ({ children }) => {
  const { user } = useUser();
  const role = user.role;

  return (
    <>
      <div className="mt-32">
        <Container className="flex">
          <div className={`${role === "admin" ? "h-[110vh]" : role === "SELLER" ? "h-[80vh]" : "h-[70vh]"} w-[25%] shadow-s1 py-8 p-5 rounded-lg`}>
            <Sidebar role={role} />
          </div>
          <div className="w-[75%] px-5 ml-10 rounded-lg">{children}</div>
        </Container>
      </div>
    </>
  );
};
