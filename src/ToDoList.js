import React, { useState } from 'react'
import { gql, useMutation, useQuery } from "@apollo/client";

export const GET_TODOLIST = gql`
query listTodos {
    listTodos {
      items {
        description
        id
        name
        when
        where
      }
    }
  
  }
`;

export const ADD_TODO = gql`
mutation createTodo($createtodoinput: CreateTodoInput!) {
    createTodo(input: $createtodoinput) {
      where
      when
      name
      id
      description
    }
  }
`

export const UPDATE_TODO = gql`
mutation updateToDo($updatetodoinput: UpdateTodoInput!) {
    updateTodo(input: $updatetodoinput) {
      id
      description
      name
      when
      where
    }
  }  
`

export const DELETE_TODO = gql`
mutation deleteToDo($deletetodoinput: DeleteTodoInput!) {
    deleteTodo(input: $deletetodoinput) {
      id
    }
  }  
`

const ToDoList = () => {
    const { loading, error, data } = useQuery(GET_TODOLIST);
    const [createTodo] = useMutation(ADD_TODO, {
        refetchQueries: [{ query: GET_TODOLIST }]
    });

    const [deleteTodo] = useMutation(DELETE_TODO, {
        refetchQueries: [{ query: GET_TODOLIST }]
    });

    const [isUpdate, setIsUpdate] = useState(false)

    const [updateTodo] = useMutation(UPDATE_TODO, {
        refetchQueries: [{ query: GET_TODOLIST }]
    });

    // const [todos, setTodos] = useState([]);
    const [form, setForm] = useState({
        name: '',
        when: '',
        where: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createTodo({
            variables: {
                createtodoinput: form
            }
        });
        setIsUpdate(false)


        setForm({ name: '', when: '', where: '', description: '', id: "" });
    };


    if (loading) {
        return <p>Loading...</p>; // Return a JSX element for loading state
    }

    if (error) {
        return <p>Error: {error.message}</p>; // Return a JSX element for error state
    }

    const toDoList = data.listTodos.items
    console.log("toDoList", toDoList)

    const updateToDo = (item) => {

        if (!isUpdate) {
            setForm(item)
            setIsUpdate(true)
        } else {
            updateTodo({
                variables: {
                    updatetodoinput: {
                        name: form.name,
                        when: form.when,
                        where: form.where,
                        description: form.description,
                        id: item.id
                    }
                }
            })
            setForm({ name: '', when: '', where: '', description: '', id: "" });

        }

    }

    const deleteToDo = (item) => {
        deleteTodo({
            variables: {
                deletetodoinput: {
                    id: item.id
                }
            }
        })
    }

    return (
        <>
            <h1>To Do List with AppSync</h1>

            <form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "space-around", margin: 40 }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="when"
                    placeholder="When"
                    value={form.when}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="where"
                    placeholder="Where"
                    value={form.where}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Add To-Do</button>

            </form>
            {
                toDoList.map((item, id) => {
                    return <div style={{ display: "flex", flexDirection: "row", margin: 40, justifyContent: "space-between", marginTop: 100 }} key={id}>
                        <div >
                            <div >Name : {item.name}</div>
                            <div >When : {item.when}</div>
                            <div >Where : {item.where}</div>
                            <div >Description : {item.description}</div>
                        </div>
                        <div style={{ margin: 10, width: "20%", justifyContent: "space-between", display: "flex", alignItems: "center" }}>
                            <button style={{ height: 40, width: 100 }} onClick={() => updateToDo(item)}>Update To-Do</button>
                            <button style={{ height: 40, width: 100 }} onClick={() => deleteToDo(item)}>Delete To-Do</button>
                        </div>
                    </div>

                })
            }
        </>

    )
}
export default ToDoList