//Helper used to show/hide the loading bar
const loading = window.Pace;

export default ({
  show: function () {
    if (loading) loading.restart();
  },
  hide: function () {
    if (loading) loading.stop();
  }
});
