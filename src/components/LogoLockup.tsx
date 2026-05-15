import { LeafSeparatorIcon } from "./icons";

export default function LogoLockup() {
  return (
    <span className="inline-flex items-stretch gap-1.5" aria-hidden="true">
      <span className="flex  flex-col leading-none ">
        <span className="block w-full font-semibold sm:text-[1rem]">
          FIND A
        </span>
        <span className="block w-full text-[1.18rem] uppercase sm:text-[1.4rem] font-semibold">
          Session
        </span>
      </span>
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center px-0.5 text-lichen/90"
      >
        *
      </span>
      <span className="flex flex-col justify-between h-full text-peat/85">
        <span className="flex-1" />
        <span
          className="text-[2.1rem] font-extrabold leading-none tracking-tight sm:text-[2.5rem]"
          style={{ lineHeight: 1 }}
        >
          NYC
        </span>
        <span className="flex-1" />
      </span>
    </span>
  );
}
