import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  if (notification.show) {
    return <div className={notification.cssClass}>{notification.message}</div>
  }

  return null
}

export default Notification
