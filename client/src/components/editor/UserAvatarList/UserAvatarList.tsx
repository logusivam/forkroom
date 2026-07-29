import { RoomUser } from '../../../types/room'

interface UserAvatarListProps {
  users: RoomUser[]
}

export function UserAvatarList({ users }: UserAvatarListProps) {
  const displayLimit = 5
  const displayedUsers = users.slice(0, displayLimit)
  const remainingCount = users.length - displayLimit

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="flex flex-col items-end space-y-1">
      <div className="flex items-center -space-x-2">
        {displayedUsers.map((user) => (
          <div
            key={user.id}
            style={{ backgroundColor: user.colour }}
            className="w-8 h-8 rounded-full border-2 border-surface-1 flex items-center justify-center text-xs font-bold text-black select-none"
            title={user.name}
          >
            {getInitials(user.name)}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full border-2 border-surface-1 bg-surface-3 flex items-center justify-center text-xs font-bold text-text-primary select-none">
            +{remainingCount}
          </div>
        )}
      </div>
      {users.length > 8 && (
        <span className="text-[10px] text-text-secondary select-none">
          Colours repeat beyond 8 users
        </span>
      )}
    </div>
  )
}
