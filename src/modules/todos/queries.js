const allTodos =
	"SELECT todo_id, title, status, due_date, created_at, updated_at FROM todos WHERE user_id = $1";
const newTodo =
	"INSERT INTO todos (todo_id, user_id, title, status, due_date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)";
const findTodo =
	"SELECT todo_id, user_id, title, status, due_date, created_at, updated_at FROM todos WHERE todo_id = $1";
const deleteTodo = "DELETE FROM todos WHERE todo_id = $1";

export default {
	allTodos,
	newTodo,
	findTodo,
	deleteTodo,
};
