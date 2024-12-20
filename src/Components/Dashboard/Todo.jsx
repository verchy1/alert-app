import AssignmentIcon from '@mui/icons-material/Assignment';  // Icône de clipboard
import { Box } from '@mui/material';
import "./Todo.css"
import ItemTodo from './ItemTodo';
import { useSelector } from 'react-redux';
import AddAlert from './AddAlert';

export default function Todo() {
    const todoData = useSelector(state => state.todo)
    
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="container">
                <div className="row d-flex justify-content-between align-items-center">
                    <div className="col d-flex justify-content-between">
                        <div className='d-flex justify-content-center align-items-center'>
                            <Box display="flex" alignItems="center" gap={1}>
                                <AssignmentIcon style={{ fontSize: 30, color: '#757575' }} />
                            </Box>
                        </div>
                    </div>
                    <div className="col">
                        <div className='d-flex justify-content-end align-items-center'>
                            <div style={{cursor: "pointer"}}>
                                <AddAlert />
                            </div>
                            <p className="mb-0 text-secondary">Ajouter</p>
                            
                        </div>
                    </div>
                </div>
                <div style={{ height: '600px', overflowY: 'auto', padding: "15px", }}>
                    {

                        todoData.todoCard.length > 0 ? todoData.todoCard.map(item => (
                            <ItemTodo key={item.id} id={item.id} title={item.title} description={item.description} date={item.date} autoPro={item.autoPro} localite={item.localite} Observation={item.Observation} />
                          )) : <p className='mt-4'>Aucune Alerte a afficher</p>
                    }
                    
                </div>
            </div>
        </div>
    )
}