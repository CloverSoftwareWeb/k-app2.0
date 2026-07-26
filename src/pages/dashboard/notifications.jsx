import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useFirestoreQuery } from "@/hooks/useFirestoreQuery";
import { Common } from "@/constant/strings";

export function Notifications() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const { getAllData, addNewDocument, deleteDocumentById } = useFirestoreQuery(Common.collectionName.todos);

  const loadTodos = async () => {
    try {
      const data = await getAllData();
      // sort by createdAt if available
      const sorted = data.sort((a, b) => {
        if (a.createdAt && b.createdAt) return b.createdAt - a.createdAt;
        return 0;
      });
      setTodos(sorted);
    } catch (err) {
      console.error("Failed to load todos", err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const payload = {
      text: trimmed,
      done: false,
      createdAt: Date.now(),
    };

    const res = await addNewDocument(payload);
    if (res.success) {
      setText("");
      setTodos((curr) => [{ id: res.id, ...payload }, ...curr]);
    } else {
      console.error("Add todo failed", res.error);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteDocumentById(id);
    if (res.success) {
      setTodos((curr) => curr.filter((t) => t.id !== id));
    } else {
      console.error("Delete failed", res.error);
    }
  };

  return (
    <div className="mx-auto my-20 flex max-w-screen-md flex-col gap-6">
      <Card>
        <CardHeader color="transparent" floated={false} shadow={false} className="m-0 p-4 flex items-center justify-between gap-4">
          <Typography variant="h5" color="blue-gray">
            My TODO
          </Typography>
          <div className="flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add new todo"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button size="sm" color="blue" onClick={handleAdd} className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-4">
          {todos.length === 0 && (
            <Typography color="gray">No todos yet. Add one above.</Typography>
          )}

          <ul className="flex flex-col gap-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between border rounded p-2">
                <div>
                  <Typography className="font-medium">{todo.text}</Typography>
                  <Typography variant="small" color="gray" className="text-xs">
                    {new Date(todo.createdAt || Date.now()).toLocaleString()}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton size="sm" variant="text" color="red" onClick={() => handleDelete(todo.id)}>
                    <TrashIcon className="w-4 h-4" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;
