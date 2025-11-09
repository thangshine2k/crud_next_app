import HeaderPage from "./component/HeaderPage";
import ProjectListPage from "./list-project/page";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* <HeaderPage /> */}
      <ProjectListPage />
    </div>
  );
}
