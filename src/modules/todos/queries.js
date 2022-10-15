const allTodos =
	"SELECT todo_id, title, status, due_date, created_at, updated_at FROM todos WHERE user_id = $1";
const newTodo =
	"INSERT INTO todos (todo_id, user_id, title, status, due_date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)";
const findTodo =
	"SELECT todo_id, user_id, title, status, due_date, created_at, updated_at FROM todos WHERE todo_id = $1";
const updateTitle =
	"UPDATE todos SET title = $1, updated_at = $2 WHERE todo_id = $3 RETURNING title, updated_at";
const updateStatus =
	"UPDATE todos SET status = $1, updated_at = $2 WHERE todo_id = $3 RETURNING status, updated_at";
const updateDate =
	"UPDATE todos SET due_date = $1, updated_at = $2 WHERE todo_id = $3 RETURNING due_date, updated_at";
const deleteTodo = "DELETE FROM todos WHERE todo_id = $1";

export default {
	allTodos,
	newTodo,
	findTodo,
	updateTitle,
	updateStatus,
	updateDate,
	deleteTodo,
};
