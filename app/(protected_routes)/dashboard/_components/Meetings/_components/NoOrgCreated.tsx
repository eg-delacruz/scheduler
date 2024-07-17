import Link from "next/link";

//Icons
import { Plus } from "lucide-react";

function NoOrgCreated() {
  return (
    <div className="p-5">
      <div className="flex flex-col gap-5">
        <h2 className="font-bold text-3xl">Meetings</h2>
      </div>
      <br />
      <hr />
      <br />
      <div className="border-2 p-5 rounded max-w-xl mx-auto bg-slate-50">
        <p className="text-center text-xl">
          You must first create an organization before you can start scheduling
        </p>
        <br />
        <Link href={"#"}>
          <div className="mx-auto border w-fit rounded bg-slate-200">
            <Plus size={40} color="#0e5ddd" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default NoOrgCreated;
