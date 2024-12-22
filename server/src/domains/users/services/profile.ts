import { Ok } from "resultat";
import type { NotificationService } from "../../notifications/services/notifications.js";
import type { SelectableUserStatus, UserStatus } from "../interfaces/user.js";
import type { IUserModel } from "../models/user.interface.js";

export class ProfileService {
  constructor(
    private userModel: IUserModel,
    private notificationService: NotificationService
  ) {}

  async setStatus(userId: string, selectedStatus: SelectableUserStatus) {
    // Check if status changed to prevent unnecessary notifications.
    // This would be especially bad for privacy if user was invisible and went offline.
    const getStatusResult = await this.userModel.getStatus(userId);

    if (!getStatusResult.ok) {
      return getStatusResult;
    }

    const currentStatus = getStatusResult.val;

    if (currentStatus === selectedStatus) {
      return Ok(currentStatus);
    }

    // Update to the new status
    const updateStatusResult = await this.userModel.updateStatus(
      userId,
      selectedStatus
    );

    if (!updateStatusResult.ok) {
      return updateStatusResult;
    }

    const status = selectedStatus === "invisible" ? "offline" : selectedStatus;

    // Notify the listeners
    this.notificationService.notifyUserProfileStatusChange(userId, status);

    return Ok<UserStatus>(status);
  }

  async setDisplayName(userId: string, displayName: string) {
    // TODO: prevent mutating db state and emitting on identical displayName

    // TODO: if displayName.length === 0 default to username

    const updateDisplayNameResult = await this.userModel.setDisplayName(
      userId,
      displayName
    );

    this.notificationService.notifyUserProfileDisplayNameChange(
      userId,
      displayName
    );

    if (!updateDisplayNameResult.ok) return updateDisplayNameResult;

    return Ok(displayName);
  }
}
