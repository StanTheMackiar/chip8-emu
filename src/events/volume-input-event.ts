import { speaker } from "../main";
import { muteIcon, soundIcon } from "../ui/icons/volume.icon";
import { $volumeContainer, $volumeInput } from "./dom-refs";

export const $volumeIcon = $volumeContainer.appendChild(
  document.createElement("span")
);

$volumeIcon.innerHTML = soundIcon();

export const getVolumeLevel = (): number => {
  return $volumeInput ? Number($volumeInput.value) : 0;
};

const refreshSoundIcon = () => {
  const level = getVolumeLevel();
  $volumeIcon.innerHTML = level > 0 ? soundIcon() : muteIcon();
};

$volumeInput.addEventListener("change", () => {
  const value = getVolumeLevel();
  speaker.setVolume(value);

  refreshSoundIcon();
});

$volumeIcon.addEventListener("click", () => {
  const value = getVolumeLevel();

  if (value > 0) {
    $volumeInput.value = "0";
    $volumeInput.dispatchEvent(new Event("change"));
  } else {
    $volumeInput.value = "0.5";
    $volumeInput.dispatchEvent(new Event("change"));
  }

  refreshSoundIcon();
});
