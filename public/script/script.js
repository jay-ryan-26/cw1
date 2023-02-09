let app = new Vue({
  el: "#app",

  // Initial data has been declared as a function
  data: {
    sitename: "After School Activities",
    sorting: "price",
    sortDir: "asc",
    search: "",

    // Creating lesson object
    lessons: [],
    order: {
      firstName: "",
      lastName: "",
      phone: "",
    },
    // Creating cart object with empty array
    cart: [],
    showLesson: true,
  },
  created: function () {
    console.log("requesting data from server ...");

    fetch("http://localhost:5000/lessons").then((res) => {
      res.json().then((json) => {
        app.lessons = json;
        console.log(json);
      });
    });
  },
  methods: {
    // Add the lesson to the cart
    addToCart(lesson) {
      lesson.displaySpaces--;
      this.cart.push(lesson.id);
    },
    showCheckout() {
      this.showLesson = this.showLesson ? false : true;
    },
    submitForm() {
      alert("Order Submitted");
    },
    // This computed property checks if the lesson has spaces available.
    canAddToCart(lesson) {
      return lesson.spaces > this.cartCount(lesson.id);
    },
    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) [count++];
      }
      return count;
    },
    removeItem(id) {
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
          this.lessons[i].displaySpaces++;
          break;
        }
      }
    },
  },
  // validation to get numbers only

  compare(a, b) {
    if (
      (this.sorting === "subject" && a.subject > b.subject) ||
      (this.sorting === "location" && a.location > b.location)
    ) {
      return 1;
    }
    if (
      (this.sorting === "subject" && a.subject < b.subject) ||
      (this.sorting === "location" && a.location < b.location)
    ) {
      return -1;
    }
    return 0;
  },
  // This property validates the form
  validateForm() {
    return (
      /^[0-9]+$/.test(this.order.phone) &&
      /^[a-zA-Z ]+$/.test(this.order.firstName) &&
      /^[a-zA-Z ]+$/.test(this.order.lastName)
    );
  },

  // Computed properties are added.
  computed: {
    // this computed property returns the subject of items in the cart.

    cartItemCount: function () {
      return this.cart.length || "";
    },

    sortedLessons() {
      let lessonsArray = this.lessons.slice(0);
      // sorting price
      if (this.sorting === "price") {
        return this.sortDir === "asc"
          ? lessonsArray.sort((a, b) => {
              return a.price - b.price;
            })
          : lessonsArray.sort((a, b) => {
              return b.price - a.price;
            });
      }

      // sorting spaces
      if (this.sorting === "spaces") {
        return this.sortDir === "asc"
          ? lessonsArray.sort((a, b) => {
              return a.spaces - b.spaces;
            })
          : lessonsArray.sort((a, b) => {
              return b.spaces - a.spaces;
            });
      }

      // sorting subject or location
      if (
        (this.sorting === "subject" || this.sorting === "location") &&
        this.sortDir === "asc"
      ) {
        return lessonsArray.sort(this.compare);
      } else {
        lessonsArray.sort(this.compare);
        return lessonsArray.reverse();
      }
    },
    searchFilter() {
      return this.sortedLessons.filter((lesson) => {
        return (
          lesson.subject.toLowerCase().includes(this.search.toLowerCase()) ||
          lesson.location.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
    displayCart() {
      return this.cart.map((id) => {
        return this.lessons.find((lesson) => {
          if (lesson.id === id) {
            return lesson;
          }
        });
      });
    },
  },
});
