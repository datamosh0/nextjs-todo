interface User {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  uid: string | null;
}

interface Todo {
  todo: string;
  done: boolean;
}
interface List {
  title: string;
  todo: Todo[];
}
