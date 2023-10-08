import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import SaveToDo from '@salesforce/apex/ToDoController.SaveToDo';

export default class CreateTask extends LightningElement {
    taskTitle;
    dueDate;
    showDueDate =false;
    showSave = false;
    @api targetParent;

    connectedCallback() {
        //console.log('target parent : ' + this.targetParent);
    }

    handleOnChange(event){
        const fieldName = event.target.name;
        if(fieldName == 'taskTitle'){
            this.taskTitle = event.target.value;
            if(this.taskTitle != ''){
                this.showDueDate = true;
            } else{
                this.showDueDate = false;
            }
        } else if(fieldName == 'dueDate'){
            this.dueDate = event.target.value;
            this.dueDate != "" && this.targetParent != true ? (this.showSave = true) : (this.showSave = false);
        }
    }

    handleClick(){
        //console.log('You are great');
        SaveToDo({ title:this.taskTitle, dueDate : this.dueDate })
        .then((result) => {
            if(result == 'Success'){
                this.taskTitle = '';
                this.dueDate = '';

                const evt = new ShowToastEvent({
                    title: 'Success',
                    message: 'Task Created!!',
                    variant: 'success'
                });
                this.dispatchEvent(evt);
                this.dispatchEvent(new CustomEvent('refreshtodo'));
                if(this.targetParent === true){
                    const selectedEvent = new CustomEvent('closeaction',{
                        detail: result
                    });
                    this.dispatchEvent(selectedEvent);
                }
            }
        })
        .catch((error) => {
            const evt = new ShowToastEvent({
                title: 'Error',
                message: error.body.message,
                variant: 'error'
            });
            this.dispatchEvent(evt);

        });
        
    }

    @api handleParentClick() {
        this.handleClick();
    }
}