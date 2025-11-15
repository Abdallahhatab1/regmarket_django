let close_sidebar = document.querySelector('.close_sidebar');
let open_sidebar = document.querySelector('.open_sidebar');

status = 'opened'

function start_open()
{
    if(status =='opened')
        {
            close_sidebar.style.left = '200px'
            open_sidebar.style.left = '0px'
            status = 'closed'
        }

    else
        {
            close_sidebar.style.left = '0px'
            open_sidebar.style.left = '-200px'
            status = 'opened'
        }
};