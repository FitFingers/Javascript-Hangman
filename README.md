# Javascript-Hangman
A small Hangman game made in JavaScript.

-----

Through this project, I learned how to use an API. I first learned about the XMLHttpRequest method, however after implementing it this way, I encountered the problem many would on their first API: asynchronous functions. The problem was that my word object (where I store the filtered results from each API request) was being declared with an empty response as the API wasn't returning quick enough.
Whilst reading up on promises and async/await, I stumbled upon the fetch method. This seemed too simple compared to declaring new promises the old way, but I gave them a shot and found them much easier not only to implement but also for readability; these will definitely be my method of choice when using APIs in the future.
