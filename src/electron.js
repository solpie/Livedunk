export default (vue) => {
    console.log('electron created',this)
    this.methods = {
        onRecord: () => {
            console.log('onRecord')

        }
    }
}