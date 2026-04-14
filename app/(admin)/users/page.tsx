import { User, columns } from "./colums";
import { DataTable } from "./data-table";

async function getData(): Promise<User[]> {
  // Replace with your real API call
  return [
    { id: "1", username: "john_doe",   email: "john@example.com",  role: "admin",   group: "A1" },
    { id: "2", username: "jane_smith", email: "jane@example.com",  role: "teacher", group: "B2" },
    { id: "3", username: "ali_ben",    email: "ali@example.com",   role: "student", group: "C3" },
    { id: "4", username: "sara_k",     email: "sara@example.com",  role: "parent",  group: "A1" },
    { id: "5", username: "med_amine",  email: "med@example.com",   role: "student", group: "B2" },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}