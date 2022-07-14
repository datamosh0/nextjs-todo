interface User {
  email: ?string;
  displayName: ?string;
  photoURL: ?string;
  uid: ?string;
}

interface Todo {
  todo: string;
  done: boolean;
}
interface List {
  title: string;
  todo: Todo[];
}
