$(function() {
  // When the document is ready.
  // [Retrieving the First Page of Results When the Page Loads]  // ####################################################################
  $.get(
    "https://www.cs.kent.ac.uk/people/staff/sm951/co539/assessment2/hygiene.php",
    { operation: "get", page: 1 },
    function(data) {
      $("table").append(
        "<tr><th>Name</th><th>Address</th><th>Hygiene</th><th>Rating</th></tr>"
      );

      $.each(data, function(key, value) {
        $("table").append(
          "<tr><td>" +
            value.name +
            "</td><td>" +
            value.addressLine +
            "</td><td>" +
            value.hygieneRating +
            "</td><td><button class='rating'>Get rating</button></td></tr>"
        );
      });
    },
    "json"
  );
  // ##################################################################################################################################

  // [A Basic Paginator]  // ############################################################################################################
  $.get(
    "https://www.cs.kent.ac.uk/people/staff/sm951/co539/assessment2/hygiene.php",
    { operation: "pages" },
    function(data) {
      // Adding buttons for pagination functionality
      // edit this piece of code
      $("#top-heading").html(function() {
        $(this).after("<div id='pages'>Pages: </div>");
        for (var i = 1; i <= data.pages; i++) {
          $("#pages").append(
            "<div class='btn-group'><button class='pageButtons'>" +
              i +
              "</button></div>"
          );
        }
        $("table").before("<br><br>");
      });

      // Whenever a particular button is clicked - the table is emptied and new data is appended to the table.
      $("button").each(function(index) {
        $(this).click(function() {
          // empty the results table // ".remove" ".empty"
          $("table").empty();
          // perform an AJAX request
          $.get(
            "https://www.cs.kent.ac.uk/people/staff/sm951/co539/assessment2/hygiene.php",
            { operation: "get", page: $(this).text() },
            function(data) {
              // Add headings to the table
              $("table").append(
                "<tr><th>Business</th><th>Address</th><th>Hygiene</th><th>Date</th><th>Rating</th></tr>"
              );
              // Add data to the table
              $.each(data, function(key, value) {
                $("table").append(
                  "<tr><td>" +
                    value.name +
                    "</td><td>" +
                    value.addressLine +
                    "</td><td>" +
                    value.hygieneRating +
                    "</td><td>" +
                    value.ratingDate +
                    "</td><td><button class='rating'>Get rating</button></td></tr>"
                );
                // button that allows the user to retrieve the customers’ ratings for the business in that row // implemented above // From Task 2.1
              });
            },
            "json"
          ); // retrieve data in JSON format
        });
      });
    }
  );
  // [A Basic Paginator]  // #############################################################################################################

  // [Retrieving the Customer Rating when Requested by the User]  // ####################################################################
  // var rochester = ["ME1"] ;  // ME2 , ME3
  // var chatham = ["ME4"] ; // ME5
  // var gillingham = ["ME7"] ; // ME8
  var me1 = "Rochester",
    me4 = "Chatham",
    me7 = "Gillingham";

  // functionality for a button that allows the user to retrieve the customers' ratings when clicked
  $("table").on("click", ".rating", function() {
    var nameLookup = $(this)
      .parent()
      .parent()
      .find(":first")
      .text(); // business name to search for
    var aLookup = $(this)
      .parent()
      .parent()
      .find(":first")
      .next()
      .text(); // address to search for
    var address = $(this)
      .parent()
      .parent()
      .find(":first")
      .next()
      .text();

    $.get(
      "https://www.cs.kent.ac.uk/people/staff/sm951/co539/assessment2/rating.php",
      { name: nameLookup },
      function(data) {
        // Do the following for an empty Array
        if (data.length == 0) {
          alert("There is no business matching the name: " + nameLookup + ".");
        } else {
          if (data.length == 1) {
            alert(
              "The customer rating for the business, " +
                nameLookup +
                ": " +
                data[0].rating
            );
          } else {
            data.forEach(function(value) {
              if (value.rating == null) {
                alert(
                  "There is no customer rating for the business" +
                    nameLookup +
                    "."
                );
                return false;
              }

              if (
                aLookup.includes("ME1") ||
                aLookup.includes("ME2") ||
                aLookup.includes("ME3")
              ) {
                aLookup = aLookup.slice(0, aLookup.length - 9) + ", " + me1;
              }
              if (aLookup.includes(value.vicinity)) {
                alert(
                  "The customer rating for the business, " +
                    nameLookup +
                    ": " +
                    value.rating
                );
                return false;
              }

              if (aLookup.includes("ME4") || aLookup.includes("ME5")) {
                aLookup = aLookup.slice(0, aLookup.length - 9) + ", " + me4;
              }
              if (aLookup.includes(value.vicinity)) {
                alert(
                  "The customer rating for the business, " +
                    nameLookup +
                    ": " +
                    value.rating
                );
                return false;
              }

              if (aLookup.includes("ME7") || aLookup.includes("ME8")) {
                aLookup = aLookup.slice(0, aLookup.length - 9) + ", " + me7;
              }
              if (
                aLookup.includes(value.vicinity) &&
                aLookup.search(value.vicinity)
              ) {
                alert(
                  "The customer rating for the business, " +
                    nameLookup +
                    ": " +
                    value.rating
                );
                return false;
              } else {
                if (
                  address.includes(
                    value.vicinity.substring(0, address.length - me7.length)
                  )
                ) {
                  alert(
                    "The customer rating for the business, " +
                      nameLookup +
                      ": " +
                      value.rating
                  );
                  return false;
                }
              }
            });
          }
        }
      },
      "json"
    );
  });
  // [Retrieving the Customer Rating when Requested by the User]  // ##################################################################

  // [Search Functionality with Autocomplete - Add a search input with Autocomplete] // ############################################
  var availableBusinesses = [
    "Beijing Inn",
    "Kings Kitchen",
    "Taj Cuisine",
    "Villagio"
  ]; // Pre-defined array of autocomplete tags
  var businessNamesToAdd = []; // Temporary array to store autocomplete tags for extending the pre-defined array with previous search information

  $("#business-tags").autocomplete({
    source: availableBusinesses
  });

  // what happens when the user clicks the search button //
  $("#search-btn").click(function() {
    $("table").empty();
    // perform an AJAX request
    $.get(
      "https://www.cs.kent.ac.uk/people/staff/sm951/co539/assessment2/hygiene.php",
      { operation: "search", name: $("#business-tags").val() },
      function(data) {
        $("table").append(
          "<tr><th>Business</th><th>Address</th><th>Hygiene</th><th>Date</th><th>Rating</th></tr>"
        );

        $.each(data, function(key, value) {
          $("table").append(
            "<tr><td>" +
              value.name +
              "</td><td>" +
              value.addressLine +
              "</td><td>" +
              value.hygieneRating +
              "</td><td>" +
              value.ratingDate +
              "</td><td><button class='rating'>Get rating</button></td></tr>"
          );
          // add the retrieved business names to the temporary array for later addition to the autocomplete array
          businessNamesToAdd.push(value.name);
        });

        for (var k = 0; k < businessNamesToAdd.length; k++) {
          if ($.inArray(businessNamesToAdd[k], availableBusinesses) == -1) {
            // avoiding duplicates
            // let the array of autocomplete tags be extended with previous search information
            // add the value to array
            availableBusinesses.push(businessNamesToAdd[k]);
          }
        }
        availableBusinesses.sort(); // sorting the array
      },
      "json"
    );

    $("#pages, .pageButtons").hide(); // Hide the buttons as there is only 20 businesses returned at a time
  });
  // [Search Functionality with Autocomplete - Add a search input with Autocomplete] // ############################################
}); // End of ready action
