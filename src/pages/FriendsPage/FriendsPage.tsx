import {useEffect, useState} from "react";
import {fetchFriends} from "../../services/friendsService";
import type {Friend} from "../../types/friends";
import css from "./FriendsPage.module.css";

function getWorkHours(friend: Friend): string | null {
  if (!friend.workDays || friend.workDays.length === 0) return null;
  const today = new Date().getDay();
  const index = today === 0 ? 6 : today - 1;
  const day = friend.workDays[index];
  if (!day || !day.isOpen) return null;
  return `${day.from} - ${day.to}`;
}

function isOpenToday(friend: Friend): boolean {
  if (!friend.workDays || friend.workDays.length === 0) return false;
  const today = new Date().getDay();
  const index = today === 0 ? 6 : today - 1;
  return friend.workDays[index]?.isOpen ?? false;
}

function FriendCard({friend}: {friend: Friend}) {
  const hours = getWorkHours(friend);
  const open = isOpenToday(friend);

  return (
    <div className={css.card}>
      <div className={css.logoCircle}>
        {friend.imageUrl ? (
          <img
            src={friend.imageUrl}
            alt={friend.title}
            className={css.logoImg}
          />
        ) : (
          <span className={css.logoInitials}>
            {friend.title.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className={css.partnerBody}>
        <div className={css.partnerName}>{friend.title}</div>

        {friend.email && (
          <div className={css.infoRow}>
            <span className={css.infoLabel}>Email:</span>
            <a href={`mailto:${friend.email}`} className={`${css.infoVal} ${css.infoLink}`}>{friend.email}</a>
          </div>
        )}

        {friend.address && (
          <div className={css.infoRow}>
            <span className={css.infoLabel}>Address:</span>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(friend.address)}`} target="_blank" rel="noreferrer" className={`${css.infoVal} ${css.infoLink}`}>{friend.address}</a>
          </div>
        )}

        {friend.phone && (
          <div className={css.infoRow}>
            <span className={css.infoLabel}>Phone:</span>
            <a href={`tel:${friend.phone}`} className={`${css.infoVal} ${css.infoLink}`}>{friend.phone}</a>
          </div>
        )}
      </div>

      {hours ? (
        <div className={css.timeBadge}>{hours}</div>
      ) : !friend.workDays ? (
        <div className={css.closedBadge}>No schedule</div>
      ) : !open ? (
        <div className={css.closedBadge}>Closed today</div>
      ) : null}
    </div>
  );
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFriends()
      .then((data) => setFriends(data))
      .catch(() => setError("Failed to load friends. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`${css.content} container`}>
      <h1 className={css.title}>Our friends</h1>

      {loading && <p className={css.loading}>Loading...</p>}
      {error && <p className={css.error}>{error}</p>}

      {!loading && !error && (
        <div className={css.list}>
          {[...friends]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
        </div>
      )}
    </div>
  );
}
