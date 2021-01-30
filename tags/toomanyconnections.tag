type: text

---

If you receive a "Too many connections" error, this could be as a result of several people already using the GeyserConnect to connect to the same server. This would be because the GeyserConnect is a proxy, and so any players connecting to a Java server have the IP address of the GeyserConnect from the view of the server instead of their own IP. Best thing to do is just be patient as the GC may have been rate-limited if several players connected at once.
It is also possible the server has limited the max number of connections from a single IP, and you must wait until someone leaves the server you want to play on, or you may attempt to contact the server admin to whitelist the GeyserConnect to lift the player cap.
Some reports from various admins with this issue suggest that the host may need to restart their BungeeCord/Server to clear the issue as well.
