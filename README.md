# To! Do!

A project of mine to complete a submission for TheOdinProject. This classic todo web-app is also implemented with some SOLID principles and some design patterns for practice. Here are some of the design pattern and SOLID principles used:

## PubSub / Observer pattern

This pattern is used to loosely couple the two most used objects that i used in the implementation. This loosely coupled the TodoView and TodoModel module. This pattern also makes syncing updates between the model and the view easier.

For example, one call to the notify([event]) will notify both subscriber module (todoView and todoModel) to update their own responsibility, e.g., todoView will update the UI, and todoModel with update the storage in memory and update the localStorage. Note that the notify function is called TriggerEvent in this project.

## Singleton / Revealing Module pattern

In javascript, we could make a module with IIFE(Immediately Invoked Function Expression) so that object is only created once. This Revealing Module Pattern is used for todoView and todoModel Object.

In addition, the singleton pattern is used on the EventManager class (the Publisher class for the pubsub). This makes sharing instance of this class easy between files, as we don't want multiple instance of this Object.

## Single Responsibility principle

Every object in the implementation has their own specific responsibility to make the code more maintainable. In this project, the specific examples are todoView, todoModel, and the EventManager class. The view responsibility is updating the view and registering DOM events related to the UI component, the model responsibility is for updating the localStorage and the array in memory storage, and the EventManager is a publisher class for managing the pubsub pattern.
