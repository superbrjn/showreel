/* 
1) Add OpenAPI link to index.html
2) Add there html tag with attr id
3) Add this file link to index.html
*/

window.onload = function() {
  VK.init(
    { apiId: 6764224, onlyWidgets: true },
    function(res) {
      console.log("VK OpenAPI initialized successful!");
    },
    function(res) {
      console.log("VK OpenAPI initialization error!");
    }
  );
  VK.Widgets.Comments("vk_comments", { limit: 10, attach: "*" });
};
