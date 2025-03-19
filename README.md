# Bookshelf App for Dicoding Submission Project

This is a starter project for students working on their final assignment for the [Front-End Web Programming for Beginner](https://www.dicoding.com/academies/315) class.

## Assignment Submission Guidelines  

To facilitate the evaluation of your submission, please follow these guidelines when working on this assignment:  

- Do **not** edit or remove the `data-testid` attribute from any HTML elements.  
- Related to the previous point, if you need to style an element and want to add attributes like `class`, you are allowed to do so **as long as the `data-testid` attributes and their values remain unchanged**.  
- When displaying book data, you **must** include specific attributes for each element:  

  - **`data-bookid`**: Stores the unique ID of each book.  
  - **`data-testid`**: Identifies the type of book data being displayed. Below is the list of required identifiers:  
    - **`bookItem`**: The container element holding book data.  
    - **`bookItemTitle`**: The book's title.  
    - **`bookItemAuthor`**: The author's name.  
    - **`bookItemYear`**: The book's release year.  
    - **`bookItemIsCompleteButton`**: A button to change the book's status between "Not Finished Reading" and "Finished Reading."  
    - **`bookItemDeleteButton`**: A button to delete the book.  
    - **`bookItemEditButton`**: A button to edit the book details.  

To simplify the assignment, you can follow the book template below:  

```html
<div data-bookid="{{ book_ID }}" data-testid="bookItem">
  <h3 data-testid="bookItemTitle">{{ book_title }}</h3>
  <p data-testid="bookItemAuthor">Author: {{ book_author }}</p>
  <p data-testid="bookItemYear">Year: {{ book_year }}</p>
  <div>
    <button data-testid="bookItemIsCompleteButton">{{ status_toggle_button }}</button>
    <button data-testid="bookItemDeleteButton">{{ delete_button }}</button>
    <button data-testid="bookItemEditButton">{{ edit_button }}</button>
  </div>
</div>
```

## Result
![image](https://github.com/user-attachments/assets/246c5068-a151-4f82-a22f-4a13dd9ec449)
